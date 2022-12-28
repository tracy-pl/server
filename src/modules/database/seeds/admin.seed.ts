import { Command, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

import { UsersService } from '~modules/users';
import { Provider } from '~modules/users/providers/providers.enum';

@Injectable()
export class AdminSeed {
  constructor(private readonly userService: UsersService) {}

  @Command({
    command: 'create:admin',
    describe: 'create an admin user',
  })
  async create(
    @Option({
      name: 'email',
      describe: 'admin email',
      type: 'string',
      required: true,
    })
    email: string,
    @Option({
      name: 'password',
      describe: 'admin password',
      type: 'string',
      required: true,
    })
    password: string,
    @Option({
      name: 'name',
      describe: 'admin name',
      type: 'string',
      default: 'Admin',
      required: false,
    })
    name: string,
  ) {
    await this.userService.createLocalUser(
      email,
      password,
      name,
      Provider.Local,
      true,
    );
  }
}
