import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IdToString } from '~utils/decorators/id-to-string.decorator';

import { Provider } from './providers/providers.enum';
import { User, UserDocument } from '../common/schemas/user.schema';

@Injectable()
@IdToString
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async createLocalUser(
    email: string,
    password: string,
    name: string,
    provider: Provider,
  ): Promise<User> {
    return this.userModel.create({
      email,
      password,
      name,
      providers: [provider],
    });
  }

  async createProviderUser(email: string, provider: Provider): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      {
        email,
      },
      [
        {
          $set: {
            providers: {
              $switch: {
                branches: [
                  {
                    case: {
                      $not: {
                        $in: [provider, { $ifNull: ['$providers', []] }],
                      },
                    },
                    then: {
                      $concatArrays: [
                        { $ifNull: ['$providers', []] },
                        [provider],
                      ],
                    },
                  },
                ],
                default: '$providers',
              },
            },
          },
        },
      ],
      {
        upsert: true,
        new: true,
      },
    );

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email }).lean();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id);
  }

  async update(id: string, refreshToken: string): Promise<User> {
    const result = await this.userModel.findByIdAndUpdate(id, {
      refreshToken: refreshToken,
    });
    return result;
  }

  async findById(userId: string): Promise<User> {
    return this.userModel.findById(userId);
    // .lean();
  }

  public async confirmEmail(email: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email, emailIsConfirmed: false },
      { $set: { emailIsConfirmed: true } },
      { new: true },
    );

    return user;
  }

  public async updatePassword(id, newPassword): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { password: newPassword, refreshToken: '' },
      { new: true },
    );

    return user;
  }

  public async updateAvatar(id, avatar): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, { avatar });

    return user;
  }

  public async updateProfile(id, profileData): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        name: profileData.name,
        about: profileData.about,
      },
      { runValidators: true, context: 'query', new: true },
    );

    return user;
  }
}
