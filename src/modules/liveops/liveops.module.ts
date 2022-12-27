import { Module } from '@nestjs/common';

import { LiveopsController } from './liveops.controller';

@Module({
  controllers: [LiveopsController],
})
export class LiveopsModule {}
