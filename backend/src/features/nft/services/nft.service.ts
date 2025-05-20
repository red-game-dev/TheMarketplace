import { Injectable, Inject, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import { NFTMetadataService } from './metadata.service';
import { Transaction } from '../interfaces/transaction.interface';
import { v4 as uuidv4 } from 'uuid';
import { UpdateTransactionDto } from '../dto/transfer.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { TransactionService } from 'src/features/transaction/services/transaction.service';
import { CacheService } from 'src/core/cache/cache.service';
import { NetworkService } from 'src/features/networks/services/network.service';
import { ChainId } from 'src/core/config/networks';

@Injectable()
export class NftService {
  private readonly logger = new Logger(NftService.name);
  private wallet: ethers.Wallet;
  public static readonly CACHE_KEY_PREFIX = 'NFTS_LIST_';
  private readonly TRANSACTIONS_HISTORY = TransactionService.CACHE_KEY_PREFIX;

  // Basic ABI for NFT transfers
  private readonly NFT_ABI = [
    'function transferFrom(address from, address to, uint256 tokenId)',
    'function safeTransferFrom(address from, address to, uint256 tokenId)',
    'function ownerOf(uint256 tokenId) view returns (address)',
    'function balanceOf(address owner, uint256 id) view returns (uint256)',
    'function getApproved(uint256 tokenId) view returns (address)',
    'function isApprovedForAll(address owner, address operator) view returns (bool)',
    'function approve(address to, uint256 tokenId)',
    'function setApprovalForAll(address operator, bool approved)',
  ];

  constructor(
    private configService: ConfigService,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    private metadataService: NFTMetadataService,
    private readonly cacheService: CacheService,
    private readonly networkService: NetworkService,
  ) {
    const privateKey = this.configService.get<string>('PRIVATE_KEY');

    if (!privateKey) {
      throw new Error('Missing PRIVATE_KEY configuration for NFT service');
    }

    const polygonProvider = this.networkService.getProvider(ChainId.POLYGON);
    this.wallet = new ethers.Wallet(privateKey, polygonProvider);
  }

  async getNFTs(
    walletAddress: string,
    { limit = 10, offset = 0 }: PaginationDto,
    chainId?: ChainId,
  ) {
    try {
      const chainKey = chainId ? chainId.toString() : 'all';
      const cacheKey = `${NftService.CACHE_KEY_PREFIX}${walletAddress}_${chainKey}_${limit}_${offset}`;

      const cachedNFTs = await this.cacheService.get(cacheKey);
      if (cachedNFTs) {
        return JSON.parse(cachedNFTs);
      }

      let nfts: any[] = [];

      if (chainId) {
        nfts = await this.fetchNFTsForChain(walletAddress, chainId);
      } else {
        const mainnetNetworks = this.networkService.getMainnetNetworks();
        const nftPromises = mainnetNetworks.map(network =>
          this.fetchNFTsForChain(walletAddress, network.chainId || 1),
        );

        const results = await Promise.allSettled(nftPromises);

        nfts = results.reduce((acc, result, index) => {
          if (result.status === 'fulfilled') {
            return [...acc, ...result.value];
          }
          this.logger.warn(`Failed to fetch NFTs from ${mainnetNetworks[index].name}`);
          return acc;
        }, []);
      }

      const total = nfts.length;
      const paginatedNFTs = nfts.slice(offset, offset + limit);

      const response = {
        data: paginatedNFTs,
        total,
        limit,
        offset,
        hasMore: total > offset + limit,
      };

      await this.cacheService.set(cacheKey, JSON.stringify(response), 300);

      return response;
    } catch (error: any) {
      this.logger.error(`Error in getNFTs: ${error.message}`);
      return await this.getMetadataFromDatabase(walletAddress, limit, offset, chainId);
    }
  }

  private async getMetadataFromDatabase(
    walletAddress: string,
    limit: number,
    offset: number,
    chainId?: ChainId,
  ) {
    let query = this.supabase
      .from('nft_metadata')
      .select('*', { count: 'exact' })
      .eq('owner_address', walletAddress.toLowerCase());

    if (chainId) {
      query = query.eq('chain_id', chainId);
    }

    const { data: nftsMetaData, count } = await query.range(offset, offset + limit - 1);

    return {
      data: nftsMetaData || [],
      total: count || 0,
      limit,
      offset,
      hasMore: (count || 0) > offset + limit,
    };
  }

  private async fetchNFTsForChain(walletAddress: string, chainId: ChainId) {
    const networkConfig = this.networkService.getNetworkConfig(chainId);
    this.logger.log(`Fetching NFTs for wallet ${walletAddress} on ${networkConfig.name}`);

    try {
      const transactions = await this.networkService.fetchNFTTransactions(walletAddress, chainId);

      if (!transactions.length) {
        this.logger.log(`No NFT transactions found for ${walletAddress} on ${networkConfig.name}`);
        return [];
      }

      const nfts = await this.processTransactions(walletAddress, transactions, chainId);

      await this.insertNFTsMetaData(walletAddress, nfts, chainId);

      return nfts;
    } catch (error) {
      this.logger.error(`Error fetching NFTs on ${networkConfig.name}: ${error.message}`);
      return this.getFallbackMetadata(walletAddress, chainId);
    }
  }

  private async processTransactions(walletAddress: string, transactions: any[], chainId: ChainId) {
    const uniqueTokens = new Map();
    const networkConfig = this.networkService.getNetworkConfig(chainId);

    for (const tx of transactions.reverse()) {
      const key = `${tx.contractAddress}-${tx.tokenID}-${chainId}`;

      if (tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase()) {
        try {
          const isOwner = await this.verifyNFTOwnership(
            walletAddress,
            tx.contractAddress,
            tx.tokenID,
            chainId,
          );

          if (isOwner && !uniqueTokens.has(key)) {
            const metadata = await this.metadataService.getMetadata(
              tx.contractAddress,
              tx.tokenID,
              chainId,
            );
            uniqueTokens.set(key, {
              contractAddress: tx.contractAddress,
              tokenId: tx.tokenID,
              tokenType: 'ERC721',
              metadata,
              tokenName: tx.tokenName || `NFT ${tx.tokenID}`,
              chainId: chainId,
              networkName: networkConfig.name,
            });
          }
        } catch (error: any) {
          this.logger.error(
            `Error processing token ${tx.tokenID} from ${tx.contractAddress} on ${networkConfig.name}: ${error.message}`,
          );
        }
      } else if (tx.from && tx.from.toLowerCase() === walletAddress.toLowerCase()) {
        uniqueTokens.delete(key);
      }
    }

    return Array.from(uniqueTokens.values());
  }

  private async insertNFTsMetaData(walletAddress: string, nfts: any[], chainId: ChainId) {
    try {
      if (nfts.length === 0) return;

      const nftMetaDataData = nfts.map(nft => ({
        owner_address: walletAddress.toLowerCase(),
        contract_address: nft.contractAddress.toLowerCase(),
        token_id: nft.tokenId,
        chain_id: chainId,
        network_name: nft.networkName || this.networkService.getNetworkConfig(chainId).name,
        metadata: nft.metadata,
        token_type: nft.tokenType || 'ERC721',
        last_updated: new Date().toISOString(),
      }));

      const { error } = await this.supabase.from('nft_metadata').upsert(nftMetaDataData, {
        onConflict: 'contract_address,token_id,chain_id',
      });

      if (error) {
        this.logger.error(`nftMetaData upsert error: ${error.message}`);

        for (const nft of nftMetaDataData) {
          try {
            await this.supabase.from('nft_metadata').upsert(nft, {
              onConflict: 'contract_address,token_id,chain_id',
            });
          } catch (individualError: any) {
            this.logger.error(
              `Error updating individual NFT ${nft.contract_address}:${nft.token_id} on chain ${chainId}: ${individualError.message}`,
            );
          }
        }
      }

      const validTokenKeys = new Set(
        nftMetaDataData.map(nft => `${nft.contract_address}-${nft.token_id}-${nft.chain_id}`),
      );

      const { data: existingEntries } = await this.supabase
        .from('nft_metadata')
        .select('contract_address, token_id, chain_id')
        .eq('owner_address', walletAddress.toLowerCase())
        .eq('chain_id', chainId);

      if (existingEntries) {
        const entriesToDelete = existingEntries.filter(
          entry =>
            !validTokenKeys.has(`${entry.contract_address}-${entry.token_id}-${entry.chain_id}`),
        );

        if (entriesToDelete.length > 0) {
          this.logger.log(`Deleting ${entriesToDelete.length} obsolete NFT entries`);

          for (const entry of entriesToDelete) {
            await this.supabase
              .from('nft_metadata')
              .delete()
              .eq('owner_address', walletAddress.toLowerCase())
              .eq('contract_address', entry.contract_address)
              .eq('token_id', entry.token_id)
              .eq('chain_id', entry.chain_id);
          }
        }
      }
    } catch (error: any) {
      this.logger.error(`Error caching NFTs on chain ${chainId}: ${error.message}`);
    }
  }

  private async getFallbackMetadata(walletAddress: string, chainId?: ChainId) {
    let query = this.supabase
      .from('nft_metadata')
      .select('*')
      .eq('owner_address', walletAddress.toLowerCase());

    if (chainId) {
      query = query.eq('chain_id', chainId);
    }

    const { data: metadataNFTs } = await query;

    return metadataNFTs || [];
  }

  async verifyNFTOwnership(
    walletAddress: string,
    contractAddress: string,
    tokenId: string,
    chainId: ChainId = ChainId.POLYGON,
  ): Promise<boolean> {
    try {
      const provider = this.networkService.getProvider(chainId);
      const contract = new ethers.Contract(contractAddress, this.NFT_ABI, provider);

      try {
        const owner = await contract.ownerOf(tokenId);
        return owner.toLowerCase() === walletAddress.toLowerCase();
      } catch {
        try {
          const balance = await contract.balanceOf(walletAddress, tokenId);
          return balance.gt(0);
        } catch (innerError: any) {
          this.logger.error(`Error verifying NFT ownership on ${chainId}:`, innerError);
          return false;
        }
      }
    } catch (error) {
      this.logger.error(`Error verifying NFT ownership on chain ${chainId}: ${error.message}`);
      return false;
    }
  }

  async transferNFT(
    fromAddress: string,
    toAddress: string,
    contractAddress: string,
    tokenId: string,
    tokenType?: string,
    chainId: ChainId = ChainId.POLYGON,
  ): Promise<Transaction> {
    const transactionId = uuidv4();
    const networkConfig = this.networkService.getNetworkConfig(chainId);

    try {
      if (!ethers.utils.isAddress(fromAddress) || !ethers.utils.isAddress(toAddress)) {
        throw new BadRequestException('Invalid addresses');
      }

      const { error: insertError } = await this.supabase
        .from('transactions')
        .insert({
          id: transactionId,
          from_address: fromAddress.toLowerCase(),
          to_address: toAddress.toLowerCase(),
          contract_address: contractAddress,
          token_id: tokenId,
          chain_id: chainId,
          network_name: networkConfig.name,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        throw new Error('Failed to create transaction record');
      }

      await this.clearNetworkCache(fromAddress, chainId);
      await this.clearNetworkCache(toAddress, chainId);

      return {
        id: transactionId,
        fromAddress,
        toAddress,
        contractAddress,
        tokenId,
        chainId,
        networkName: networkConfig.name,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error: any) {
      await this.supabase
        .from('transactions')
        .update({
          status: 'failed',
          error: error.message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', transactionId);

      throw error;
    }
  }

  async getTransactionStatus(transactionId: string): Promise<Transaction> {
    const { data: transaction, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error || !transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.chain_id) {
      await this.clearNetworkCache(transaction.from_address, transaction.chain_id);
      await this.clearNetworkCache(transaction.to_address, transaction.chain_id);
    } else {
      await this.clearCache(transaction.from_address);
      await this.clearCache(transaction.to_address);
    }

    return {
      id: transaction.id,
      fromAddress: transaction.from_address,
      toAddress: transaction.to_address,
      contractAddress: transaction.contract_address,
      tokenId: transaction.token_id,
      chainId: transaction.chain_id,
      networkName: transaction.network_name,
      status: transaction.status,
      txHash: transaction.tx_hash,
      error: transaction.error,
      createdAt: new Date(transaction.created_at),
      updatedAt: new Date(transaction.updated_at),
    };
  }

  async clearCache(walletAddress: string) {
    const cacheKeyFromAddress = `${NftService.CACHE_KEY_PREFIX}${walletAddress}*`;
    const cacheKeyTransactionsHistoryFromAddress = `${this.TRANSACTIONS_HISTORY}${walletAddress}*`;

    const keysFromAddress = await this.cacheService.keys(cacheKeyFromAddress);
    const keysTransactionsHistory = await this.cacheService.keys(
      cacheKeyTransactionsHistoryFromAddress,
    );
    const keys = [...keysFromAddress, ...keysTransactionsHistory];

    this.logger.log(`Clearing all cache for wallet ${walletAddress}: keys [${keys.join(', ')}]`);

    await Promise.all(
      keys.map(async key => {
        await this.cacheService.del(key);
        this.logger.log(`Deleted cache key: ${key}`);
      }),
    );

    const remainingKeysFromAddress = await this.cacheService.keys(cacheKeyFromAddress);
    const remainingKeysTransactionsHistory = await this.cacheService.keys(
      cacheKeyTransactionsHistoryFromAddress,
    );
    const remainingKeys = [...remainingKeysFromAddress, ...remainingKeysTransactionsHistory];

    if (remainingKeys.length > 0) {
      this.logger.error(
        `Cache clearance incomplete for wallet ${walletAddress}. Remaining keys: ${remainingKeys.join(', ')}`,
      );
    } else {
      this.logger.log(`Cache successfully cleared for wallet ${walletAddress}`);
    }
  }

  async clearNetworkCache(walletAddress: string, chainId: ChainId) {
    const cacheKey = `${NftService.CACHE_KEY_PREFIX}${walletAddress}_${chainId}*`;
    const cacheKeyTransactionsHistory = `${this.TRANSACTIONS_HISTORY}${walletAddress}_${chainId}*`;

    const keys = [
      ...(await this.cacheService.keys(cacheKey)),
      ...(await this.cacheService.keys(cacheKeyTransactionsHistory)),
    ];

    if (keys.length > 0) {
      this.logger.log(
        `Clearing cache for wallet ${walletAddress} on chain ${chainId}: ${keys.length} keys`,
      );

      await Promise.all(
        keys.map(async key => {
          await this.cacheService.del(key);
        }),
      );

      this.logger.log(`Cache cleared for wallet ${walletAddress} on chain ${chainId}`);
    }

    const allCacheKey = `${NftService.CACHE_KEY_PREFIX}${walletAddress}_all*`;
    const allKeys = await this.cacheService.keys(allCacheKey);

    if (allKeys.length > 0) {
      await Promise.all(
        allKeys.map(async key => {
          await this.cacheService.del(key);
        }),
      );
    }
  }

  async updateTransactionStatus(
    transactionId: string,
    updateDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.getTransactionStatus(transactionId);

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    const { error: updateError } = await this.supabase
      .from('transactions')
      .update({
        status: updateDto.status,
        tx_hash: updateDto.txHash,
        error: updateDto.error,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transactionId);

    if (updateError) {
      throw new Error('Failed to update transaction status');
    }

    if (transaction.chainId) {
      await this.clearNetworkCache(transaction.fromAddress, transaction.chainId);
      await this.clearNetworkCache(transaction.toAddress, transaction.chainId);
    } else {
      await this.clearCache(transaction.fromAddress);
      await this.clearCache(transaction.toAddress);
    }

    return this.getTransactionStatus(transactionId);
  }
}
