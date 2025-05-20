import { Module } from '@nestjs/common';
import { NftService } from './services/nft.service';
import { NftController } from './nft.controller';
import { NFTMetadataService } from './services/metadata.service';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from 'src/core/cache/cache.service';
import { NetworkService } from 'src/features/networks/services/network.service';

@Module({
  imports: [ConfigModule],
  providers: [NftService, CacheService, NFTMetadataService, NetworkService],
  controllers: [NftController],
  exports: [NftService, NFTMetadataService, NetworkService],
})
export class NftModule {}
