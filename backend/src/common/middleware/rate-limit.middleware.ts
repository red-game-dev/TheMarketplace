import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { TooManyRequestsException } from '../exceptions/custom-exceptions';
import { CacheService } from 'src/core/cache/cache.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly rateLimiter: RateLimiterRedis;

  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {
    this.rateLimiter = new RateLimiterRedis({
      storeClient: this.cacheService.getRedisClient(),
      keyPrefix: 'ratelimit',
      points: this.configService.get<number>('RATE_LIMIT_POINTS', 60),
      duration: this.configService.get<number>('RATE_LIMIT_DURATION', 60),
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const key = req.params.walletAddress ? `${req.ip}-${req.params.walletAddress}` : req.ip;

      await this.rateLimiter.consume(key || '');
      next();
    } catch {
      res.header('Retry-After', '60');
      throw new TooManyRequestsException('Too many requests, please try again later');
    }
  }
}
