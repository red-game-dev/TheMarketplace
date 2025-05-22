import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import {
  ChainId,
  NetWorkConfigList,
  NetworkType,
  getNetworkConfigs,
} from 'src/core/config/networks';
import { CacheService } from 'src/core/cache/cache.service';

@Injectable()
export class NetworkService {
  private readonly logger = new Logger(NetworkService.name);
  private networkConfigs: NetWorkConfigList;
  private providers: Map<ChainId, ethers.providers.JsonRpcProvider> = new Map();

  constructor(
    private configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {
    this.networkConfigs = getNetworkConfigs(configService);
    this.initializeProviders();
  }

  private initializeProviders() {
    Object.values(this.networkConfigs).forEach(network => {
      if (network.rpcUrl) {
        try {
          const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
          provider.polling = true;
          provider.pollingInterval = 10000;
          this.providers.set(network?.chainId || 1, provider);
          this.logger.log(`Initialized provider for ${network.name}`);
        } catch (error) {
          this.logger.error(`Failed to initialize provider for ${network.name}: ${error.message}`);
        }
      }
    });
  }

  getNetworkConfig(chainId: ChainId): NetWorkConfigList[ChainId] {
    const config = this.networkConfigs[chainId];
    if (!config) {
      throw new NotFoundException(`Network with chainId ${chainId} not found`);
    }
    return config;
  }

  getProvider(chainId: ChainId): ethers.providers.JsonRpcProvider {
    const provider = this.providers.get(chainId);
    if (!provider) {
      throw new NotFoundException(`Provider for chainId ${chainId} not found`);
    }
    return provider;
  }

  getAllNetworks(): NetWorkConfigList[ChainId][] {
    return Object.values(this.networkConfigs);
  }

  getMainnetNetworks(): NetWorkConfigList[ChainId][] {
    return Object.values(this.networkConfigs).filter(config => config.type === NetworkType.MAINNET);
  }

  getTestnetNetworks(): NetWorkConfigList[ChainId][] {
    return Object.values(this.networkConfigs).filter(config => config.type === NetworkType.TESTNET);
  }

  async fetchNFTTransactions(walletAddress: string, chainId: ChainId): Promise<any[]> {
    const network = this.getNetworkConfig(chainId);

    try {
      const params = new URLSearchParams({
        module: 'account',
        action: 'tokennfttx',
        address: walletAddress,
        startblock: '0',
        endblock: '999999999',
        sort: 'asc',
        apikey: network.scanApiKey || '',
      });

      console.log('network', network, params);

      const url = `${network.scanApiEndpoint}?${params.toString()}`;

      this.logger.log(`Fetching NFT transactions from ${network.name} for ${walletAddress}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      console.log('url', url, chainId, walletAddress);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === '1' && Array.isArray(data.result)) {
        this.logger.log(`Found ${data.result.length} NFT transactions on ${network.name}`);
        return data.result.map(tx => ({
          ...tx,
          chainId,
          network: network.name,
        }));
      }

      return [];
    } catch (error) {
      this.logger.error(`Error fetching NFT transactions from ${network.name}: ${error.message}`);
      return [];
    }
  }

  switchNetworkMode(mode: NetworkType): Partial<NetWorkConfigList[ChainId]>[] {
    this.logger.log(`Switching to ${mode} mode`);

    if (mode === NetworkType.MAINNET) {
      return this.getMainnetNetworks();
    } else {
      return this.getTestnetNetworks();
    }
  }

  // Cache-related methods
  async clearNetworkCache(walletAddress: string, chainId: ChainId) {
    const cacheKey = `NFT_${chainId}_${walletAddress}*`;
    const keys = await this.cacheService.keys(cacheKey);

    this.logger.log(
      `Clearing cache for wallet ${walletAddress} on chain ${chainId}: ${keys.length} keys`,
    );

    await Promise.all(
      keys.map(async key => {
        await this.cacheService.del(key);
      }),
    );
  }
}
