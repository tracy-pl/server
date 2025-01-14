import { Module } from '@nestjs/common';
// import { BullModule } from '@nestjs/bull';
// import { ConfigService } from '@nestjs/config';

import { ConfigModule } from './config/config.module';
import { LiveopsModule } from './liveops/liveops.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// import { MailModule } from './mail/mail.module';
// import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule,
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     redis: {
    //       host: configService.get('database.redis.host'),
    //       port: Number(configService.get('database.redis.port')),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    LiveopsModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    // MailModule,
    // FilesModule,
  ],
})
export class AppModule {}
