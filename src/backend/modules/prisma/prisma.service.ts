import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Successfully connected to Database');
    } catch (error) {
      console.error('Failed to connect to Database on startup. Ensure DATABASE_URL is correct.', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
