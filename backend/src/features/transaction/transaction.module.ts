import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './services/transaction.service';
import { NFTMetadataService } from 'src/features/nft/services/metadata.service';
import { CacheService } from 'src/core/cache/cache.service';
import { NetworkService } from 'src/features/networks/services/network.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, CacheService, NFTMetadataService, NetworkService],
  exports: [TransactionService],
})
export class TransactionModule {}
