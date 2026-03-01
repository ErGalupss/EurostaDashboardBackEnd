import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class FeatureFlagsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {}

  async isEnabled(key: string, tenantId?: string, userId?: string): Promise<boolean> {
    const cacheKey = `ff:${key}:${tenantId || 'global'}`;
    const cached = await this.redis.get(cacheKey);
    
    let flag;
    if (cached) {
      flag = JSON.parse(cached);
    } else {
      flag = await this.prisma.featureFlag.findFirst({
        where: { key, OR: [{ tenantId }, { tenantId: null }] },
        orderBy: { tenantId: 'desc' } // Tenant specific takes precedence
      });
      if (flag) await this.redis.set(cacheKey, JSON.stringify(flag), 300);
    }

    if (!flag || !flag.enabled) return false;

    // Rollout logic (deterministic based on userId)
    if (flag.rollout < 100 && userId) {
      const hash = this.simpleHash(userId + key);
      return (hash % 100) < flag.rollout;
    }

    return true;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  async updateFlag(key: string, data: any, tenantId?: string) {
    const flag = await this.prisma.featureFlag.upsert({
      where: { key },
      update: { ...data, tenantId },
      create: { key, ...data, tenantId }
    });

    // Invalidate cache
    await this.redis.del(`ff:${key}:${tenantId || 'global'}`);
    return flag;
  }
}
