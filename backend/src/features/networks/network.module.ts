import { Module } from '@nestjs/common';
import { NetworkController } from './network.controller';
import { NetworkService } from './services/network.service';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from 'src/core/cache/cache.service';
import { CacheModule } from 'src/core/cache/cache.module';

@Module({
  imports: [CacheModule, ConfigModule],
  providers: [NetworkService, CacheService],
  controllers: [NetworkController],
  exports: [NetworkService],
})
export class NetworkModule {}
