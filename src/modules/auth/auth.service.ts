import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { RegisterRequest } from './dto/requests.dto';
import { UserResponseDto } from '../users/dto/responses.dto';
import { MailConfirmationService } from '../mail/mailConfirmation.service';
import { UsersService } from '~modules/users';
import { MailService } from '~modules/mail/mail.service';
import { User } from '~modules/common/schemas/user.schema';
import { Provider } from '~modules/users/providers/providers.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailConfirmationService: MailConfirmationService,
    private mailService: MailService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.usersService.findOne(email);
    const isPasswordMatching = await bcrypt.compare(pass, user.password);

    if (user && isPasswordMatching && user.providers.includes(Provider.Local)) {
      delete user.password;
      return user;
    }

    return null;
  }

  async registerUser({
    email,
    password,
    name,
    provider,
  }: RegisterRequest & { provider: Provider }): Promise<void> {
    await this.usersService.createLocalUser(email, password, name, provider);
    // this.sendVerificationLink(email);
    return;
  }

  async registerUserWithProvider({
    email,
    provider,
  }: {
    email: string;
    provider: Provider;
  }): Promise<User> {
    const user = await this.usersService.createProviderUser(email, provider);

    if (!user || typeof user === 'boolean') {
      throw new ConflictException('User already exists');
    }
    return user;
  }

  async sendVerificationLink(email: string): Promise<void> {
    return this.mailConfirmationService.sendVerificationLink(email);
  }

  async createTokens(
    user: Partial<User>,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessTokenPayload = {
      email: user.email,
      sub: user._id,
      emailIsConfirmed: user.emailIsConfirmed,
      tokenType: 'access',
      avatarURL: user.avatar?.url,
      roles: user.roles,
    };
    const refreshToken = this.jwtService.sign(
      { sub: user._id, tokenType: 'refresh' },
      {
        secret: this.configService.get('auth.refreshSecret'),
        expiresIn: this.configService.get('auth.refreshTokenExpiresIn'),
      },
    );
    await this.saveHashedRefreshToken(refreshToken, user._id);

    return {
      accessToken: this.jwtService.sign(accessTokenPayload),
      refreshToken,
    };
  }

  async saveHashedRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    return this.usersService.setRefreshToken(hashedRefreshToken, userId);
  }

  async saveEmptyRefreshToken(userId: string): Promise<void> {
    return this.usersService.setRefreshToken('', userId);
  }

  async compareRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findById(userId);
    const tokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!tokenValid || !user.refreshToken) {
      throw new ForbiddenException('refresh token not valid');
    }

    return await this.createTokens(user);
  }

  async sendDropPasswordToken(email: string): Promise<void> {
    const user = await this.usersService.findOne(email);
    //check provider
    if (!user) return;
    if (!user.providers.includes(Provider.Local)) return;
    const key = await bcrypt.hash(user.password.slice(10, 18), 10);
    const token = this.jwtService.sign(
      { id: user._id, key },
      {
        secret: this.configService.get('auth.dropPasswordSecret'),
        expiresIn: this.configService.get('auth.dropPasswordTokenExpiresIn'),
      },
    );

    const url = `${this.configService.get(
      'emailConstants.emailDropPasswordUrl',
    )}?token=${token}`;

    const text = `To drop password, click here: ${url}`;

    this.mailService.sendMail({
      from: this.configService.get('emailConstants.emailSender'),
      to: email,
      subject: 'Email password reset',
      text,
    });

    return;
  }

  async updatePassword(token: string, newPassword: string): Promise<void> {
    try {
      const { id, key } = this.jwtService.verify<{
        id: string;
        key: string;
      }>(token, {
        secret: this.configService.get('auth.dropPasswordSecret'),
      });

      const user = await this.usersService.findById(id);
      const validKey = await bcrypt.compare(user.password.slice(10, 18), key);

      if (!validKey) throw new Error('Not valid key');

      const samePassword = await bcrypt.compare(newPassword, user.password);

      if (samePassword) throw new Error('Old and new password a the same');

      await this.usersService.updatePassword(id, newPassword);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Old and new password a the same'
      ) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Token not valid');
    }
    return;
  }
}
