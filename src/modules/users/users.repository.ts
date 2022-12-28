import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IdToString } from '~utils/decorators/id-to-string.decorator';

import { Provider } from './providers/providers.enum';
import { User, UserDocument } from '../common/schemas/user.schema';
import { Role } from '~modules/users/roles/role.enum';

@Injectable()
@IdToString
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findAll(): Promise<User[]> {
    return this.userModel.find() as unknown as Promise<User[]>;
  }

  async createLocalUser(
    email: string,
    password: string,
    name: string,
    provider: Provider,
    isAdmin?: boolean,
  ): Promise<User> {
    const data = {
      email,
      password,
      name,
      providers: [provider],
      roles: [Role.User],
    };

    if (isAdmin) data.roles.push(Role.Admin);

    return this.userModel.create(data);
  }

  async createProviderUser(email: string, provider: Provider): Promise<User> {
    return this.userModel.findOneAndUpdate(
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
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email }).lean();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id);
  }

  async update(id: string, refreshToken: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, {
      refreshToken: refreshToken,
    });
  }

  async findById(userId: string): Promise<User> {
    return this.userModel.findById(userId);
    // .lean();
  }

  public async confirmEmail(email: string): Promise<User> {
    return this.userModel.findOneAndUpdate(
      { email, emailIsConfirmed: false },
      { $set: { emailIsConfirmed: true } },
      { new: true },
    );
  }

  public async updatePassword(id, newPassword): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      id,
      { password: newPassword, refreshToken: '' },
      { new: true },
    );
  }

  public async updateAvatar(id, avatar): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, { avatar });
  }

  public async updateProfile(id, profileData): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      id,
      {
        name: profileData.name,
      },
      { runValidators: true, context: 'query', new: true },
    );
  }
}
