import { Module } from '@nestjs/common';
import { UiConfigController } from './ui-config.controller';
import { UiConfigService } from './ui-config.service';

@Module({
  controllers: [UiConfigController],
  providers: [UiConfigService],
  exports: [UiConfigService],
})
export class UiConfigModule {}
