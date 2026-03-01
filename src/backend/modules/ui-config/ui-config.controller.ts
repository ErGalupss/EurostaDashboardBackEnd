import { Controller, Get, Post, Patch, Body, Query, UseGuards, Req } from '@nestjs/common';
import { UiConfigService } from './ui-config.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('UI Configuration')
@Controller('ui')
export class UiConfigController {
  constructor(private uiConfigService: UiConfigService) {}

  @ApiOperation({ summary: 'Bootstrap frontend configuration' })
  @Get('bootstrap')
  async bootstrap(@Query('tenantId') tenantId?: string, @Query('env') env: string = 'prod') {
    return this.uiConfigService.getBootstrapConfig(tenantId, env);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new draft configuration' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('manage_ui')
  @Post('config')
  async createDraft(@Body() config: any, @Req() req: any) {
    return this.uiConfigService.createDraft(config, req.user.id, req.user.tenantId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a configuration version' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('manage_ui')
  @Patch('publish')
  async publish(
    @Body('versionId') versionId: string,
    @Body('environment') environment: string,
    @Req() req: any
  ) {
    return this.uiConfigService.publish(versionId, environment, req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rollback to previous configuration' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('manage_ui')
  @Post('rollback')
  async rollback(@Req() req: any, @Body('environment') environment: string) {
    return this.uiConfigService.rollback(req.user.tenantId, environment, req.user.id);
  }
}
