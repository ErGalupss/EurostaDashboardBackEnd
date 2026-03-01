import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UiConfigModule } from './modules/ui-config/ui-config.module';
import { FeatureFlagsModule } from './modules/feature-flags/feature-flags.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { RedisModule } from './modules/redis/redis.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UiConfigModule,
    FeatureFlagsModule,
    AuditLogModule,
  ],
})
export class AppModule {}
