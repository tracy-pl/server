import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '~modules/users/users.module';

import seeds from './seeds';

@Module({
  imports: [
    UsersModule,
    CommandModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get('database.mongo.username');
        const password = configService.get('database.mongo.password');
        const database = configService.get('database.mongo.database');
        const host = configService.get('database.mongo.host');
        const uri =
          configService.get('database.mongo.mongoDbUrl') ||
          `mongodb+srv://${username}:${password}@${host}/${database}`;

        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [...seeds],
  exports: [...seeds],
})
export class DatabaseModule {}
