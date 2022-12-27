import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { User } from '../common/schemas/user.schema';
import { UsersService } from '../users/users.service';

import { MailService } from './mail.service';

@Injectable()
export class MailConfirmationService {
  constructor(
    private configService: ConfigService,
    private mailService: MailService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  public sendVerificationLink(email: string): Promise<void> {
    const token = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('email.tokenSecret'),
        expiresIn: this.configService.get('email.tokenExpiresIn'),
      },
    );

    const url = `${this.configService.get(
      'emailConstants.emailConfirmationUrl',
    )}?token=${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.mailService.sendMail({
      from: this.configService.get('email.sender'),
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }
  public async getEmailFromToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('email.tokenSecret'),
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error instanceof Error && error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }

    return;
  }

  public async confirmEmail(email: string): Promise<User> {
    const user = await this.usersService.confirmEmail(email);
    if (!user) {
      throw new BadRequestException('Email already confirmed');
    }
    return user;
  }
}
