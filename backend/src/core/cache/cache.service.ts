import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private readonly redis: Redis;

  constructor() {
    console.log('Redis client initialized with ', process.env.REDIS_PUBLIC_URL);
    this.redis = new Redis(process.env.REDIS_PUBLIC_URL || '');
  }

  getRedisClient(): Redis {
    return this.redis;
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async set(key: string, value: string, ttl: number = 3600): Promise<'OK'> {
    return await this.redis.set(key, value, 'EX', ttl); // TTL is in seconds
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }

  async exists(key: string): Promise<number> {
    return await this.redis.exists(key);
  }

  async keys(key: string): Promise<string[]> {
    return await this.redis.keys(key);
  }
}
