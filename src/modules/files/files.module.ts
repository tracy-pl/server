import * as redisStore from 'cache-manager-redis-store';
import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PublicFile,
  PublicFileSchema,
} from '~modules/common/schemas/publicFile.schema';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PublicFilesRepository } from './publicFiles.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PublicFile.name, schema: PublicFileSchema },
    ]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('database.redis.host'),
        port: Number(configService.get('database.redis.port')),
        ttl: 120,
      }),
    }),
  ],
  providers: [FilesService, PublicFilesRepository],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
