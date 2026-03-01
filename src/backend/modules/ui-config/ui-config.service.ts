import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

@Injectable()
export class UiConfigService implements OnModuleInit {
  private ajv: Ajv;
  private readonly UI_CONFIG_SCHEMA = {
    type: 'object',
    properties: {
      version: { type: 'number' },
      theme: { type: 'object' },
      sidebar: { type: 'array' },
      modules: { type: 'object' },
      pages: { type: 'object' },
      forms: { type: 'object' }
    },
    required: ['version', 'sidebar', 'pages']
  };

  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {
    this.ajv = new Ajv();
    addFormats(this.ajv);
  }

  onModuleInit() {
    this.ajv.compile(this.UI_CONFIG_SCHEMA);
  }

  async getBootstrapConfig(tenantId?: string, environment: string = 'prod') {
    const cacheKey = `ui:bootstrap:${tenantId || 'global'}:${environment}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const config = await this.prisma.uiConfigVersion.findFirst({
      where: { tenantId, environment, published: true },
      orderBy: { version: 'desc' }
    });

    if (!config) throw new BadRequestException('No published configuration found');

    await this.redis.set(cacheKey, JSON.stringify(config.config), 3600);
    return config.config;
  }

  async createDraft(data: any, userId: string, tenantId?: string) {
    // Validate schema
    const validate = this.ajv.getSchema('ui-config') || this.ajv.compile(this.UI_CONFIG_SCHEMA);
    const valid = validate(data);
    if (!valid) {
      throw new BadRequestException(this.ajv.errorsText(validate.errors));
    }

    const lastVersion = await this.prisma.uiConfigVersion.findFirst({
      where: { tenantId },
      orderBy: { version: 'desc' }
    });

    const newVersion = (lastVersion?.version || 0) + 1;

    return this.prisma.uiConfigVersion.create({
      data: {
        version: newVersion,
        config: data,
        published: false,
        environment: 'dev',
        tenantId,
        createdBy: userId,
        updatedBy: userId
      }
    });
  }

  async publish(versionId: string, environment: string, userId: string) {
    const config = await this.prisma.uiConfigVersion.findUnique({
      where: { id: versionId }
    });

    if (!config) throw new BadRequestException('Config not found');

    // Transaction to update published status and clear cache
    return this.prisma.$transaction(async (tx) => {
      // Unpublish previous for this env/tenant
      await tx.uiConfigVersion.updateMany({
        where: { tenantId: config.tenantId, environment, published: true },
        data: { published: false }
      });

      // Publish new
      const updated = await tx.uiConfigVersion.update({
        where: { id: versionId },
        data: { published: true, environment, updatedBy: userId }
      });

      // Invalidate cache
      const cacheKey = `ui:bootstrap:${config.tenantId || 'global'}:${environment}`;
      await this.redis.del(cacheKey);

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: 'PUBLISH_UI_CONFIG',
          entityType: 'UI_CONFIG',
          entityId: versionId,
          newValue: config.config as any,
          userId
        }
      });

      return updated;
    });
  }

  async rollback(tenantId: string | undefined, environment: string, userId: string) {
    const previousPublished = await this.prisma.uiConfigVersion.findFirst({
      where: { tenantId, environment, published: false },
      orderBy: { updatedAt: 'desc' }
    });

    if (!previousPublished) throw new BadRequestException('No previous version to rollback to');

    return this.publish(previousPublished.id, environment, userId);
  }
}
