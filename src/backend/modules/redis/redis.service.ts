import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis | null = null;
  private memoryCache: Map<string, { value: string; expires: number | null }> = new Map();
  private isConnected = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    
    if (redisUrl) {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
          if (times > 3) return null; // Stop retrying after 3 attempts
          return Math.min(times * 50, 2000);
        },
      });
      
      this.client.on('connect', () => {
        this.isConnected = true;
        console.log('Redis connected successfully');
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        console.warn('Redis connection failed, falling back to in-memory cache:', err.message);
      });
    } else {
      console.warn('REDIS_URL not provided, using in-memory cache');
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.get(key);
      } catch (err) {
        this.isConnected = false;
      }
    }

    const cached = this.memoryCache.get(key);
    if (cached) {
      if (cached.expires && cached.expires < Date.now()) {
        this.memoryCache.delete(key);
        return null;
      }
      return cached.value;
    }
    return null;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        if (ttl) {
          await this.client.set(key, value, 'EX', ttl);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch (err) {
        this.isConnected = false;
      }
    }

    this.memoryCache.set(key, {
      value,
      expires: ttl ? Date.now() + ttl * 1000 : null,
    });
  }

  async del(key: string): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        await this.client.del(key);
        return;
      } catch (err) {
        this.isConnected = false;
      }
    }
    this.memoryCache.delete(key);
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }
}
