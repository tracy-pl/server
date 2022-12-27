import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import helmet from 'helmet';
import compression from 'compression';

import { AppModule } from '~modules/app.module';
import { validationOptions } from '~utils/validation.util';
import { MongoExceptionFilter } from '~utils/filters/mongo-exception.filter';

import packageJson from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());

  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  const options = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/swagger', app, document);

  const port = configService.get('app.port');

  await app.listen(port);
}

bootstrap().catch(console.error);
