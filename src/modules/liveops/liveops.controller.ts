import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import packageJson from '../../../package.json';

@Controller('liveops')
@ApiTags('Liveops')
export class LiveopsController {
  @Get('/ping')
  ping() {
    return 'pong';
  }

  @Get('/status')
  status() {
    return { status: 'ok' };
  }

  @Get('/version')
  version() {
    return { version: packageJson.version };
  }
}
