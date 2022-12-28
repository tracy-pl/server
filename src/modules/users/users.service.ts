import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Provider } from './providers/providers.enum';
import { User } from '../common/schemas/user.schema';
import { UsersRepository } from './users.repository';
import { FilesService } from '~modules/files/files.service';
import { PublicFile } from '~modules/common/schemas/publicFile.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private configService: ConfigService,
    private readonly filesService: FilesService,
  ) {}
  async createLocalUser(
    email: string,
    password: string,
    name: string,
    provider: Provider,
    isAdmin?: boolean,
  ): Promise<User> {
    return this.usersRepository.createLocalUser(
      email,
      password,
      name,
      provider,
      isAdmin,
    );
  }

  async createProviderUser(email: string, provider: Provider): Promise<User> {
    return this.usersRepository.createProviderUser(email, provider);
  }

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.remove(id);

    if (!result) {
      throw new NotFoundException();
    }
  }

  async setRefreshToken(refreshToken: string, userId: string): Promise<void> {
    const user = await this.usersRepository.update(userId, refreshToken);

    if (!user) {
      throw new NotFoundException('Unable to set refresh token');
    }
  }

  async updateRefreshTokenForUser(
    hashedRefreshToken: string,
    userId: string,
  ): Promise<void> {
    const user = await this.usersRepository.update(userId, hashedRefreshToken);

    if (!user) {
      throw new NotFoundException('Unable update refresh token');
    }
  }

  async findById(userId: string): Promise<User> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async confirmEmail(email: string): Promise<User> {
    return this.usersRepository.confirmEmail(email);
  }

  public async updatePassword(id: string, newPassword: string): Promise<User> {
    return this.usersRepository.updatePassword(id, newPassword);
  }

  public async addAvatar(
    id: string,
    imageBuffer: Buffer,
    filename: string,
  ): Promise<PublicFile> {
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
      'avatars',
    );

    const oldUser = await this.usersRepository.updateAvatar(id, avatar);
    if (oldUser.avatar) {
      await this.filesService.deletePublicFile(
        oldUser.avatar._id,
        oldUser.avatar.key,
      );
    }
    return avatar;
  }

  public async updateProfile(
    id: string,
    profileData: { about: string; name: string },
  ): Promise<User> {
    return await this.usersRepository.updateProfile(id, profileData);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }
}
