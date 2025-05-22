import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import {
  ALCHEMY_NETWORKS,
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

  getAlchemyEndpoint(chainId: ChainId): string {
    const network = ALCHEMY_NETWORKS[chainId];
    if (!network) return '';
    const key =
      this.configService.get<string>(
        `ALCHEMY_API_KEY_${network.toUpperCase().replace(/-/g, '_')}`,
        '',
      ) || this.configService.get<string>(`ALCHEMY_API_KEY`, '');
    return key ? `https://${network}.g.alchemy.com/nft/v3/${key}` : '';
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

    // If Alchemy is supported, use it
    const alchemyUrl = this.getAlchemyEndpoint(chainId);

    console.log('alchemyUrl', alchemyUrl);

    if (alchemyUrl) {
      try {
        const url = `${alchemyUrl}/getNFTsForOwner?withMetadata=true&owner=${walletAddress}&order=asc&category=erc721,erc1155`;
        console.log('url', url);
        const response = await fetch(url, {
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) throw new Error(`Alchemy API error: ${response.status}`);
        const data = await response.json();
        console.log('response', data);

        if (Array.isArray(data.ownedNfts)) {
          return data.ownedNfts.map(nft => ({
            blockNumber: data.validAt.blockNumber,
            timeStamp: new Date(nft.timeLastUpdated).getTime().toString().slice(0, 10),
            hash: nft.mint.transactionHash,
            nonce: '0',
            blockHash: data.validAt.blockHash,
            from: undefined,
            to: walletAddress,
            contractAddress: nft.contract.address,
            tokenID: nft.tokenId,
            tokenName: nft.name || nft.contract.name || `NFT ${nft.tokenId}`,
            tokenSymbol: nft.contract.symbol || '',
            tokenDecimal: '0',
            transactionIndex: '0',
            gas: '0',
            gasPrice: '0',
            gasUsed: '0',
            cumulativeGasUsed: '0',
            input: 'deprecated',
            confirmations: '0',
            chainId,
            source: 'alchemy',
            metadata: {
              name: nft.name || nft.raw?.metadata?.name,
              description: nft.description || nft.raw?.metadata?.description,
              image: nft.image?.originalUrl || nft.raw?.metadata?.image,
              attributes: nft.raw?.metadata?.attributes || [],
              tokenUri: nft.tokenUri,
              tokenType: nft.tokenType,
            },
          }));
        }
      } catch (err) {
        this.logger.error(`Alchemy fetch error on ${network.name}: ${err.message}`);
      }
    }

    // Fallback to traditional scan endpoint
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

      const scanUrl = network.scanApiEndpoint;
      const url = `${scanUrl}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();

      if (data.status === '1' && Array.isArray(data.result)) {
        return data.result.map(tx => ({
          ...tx,
          chainId,
          source: 'scan',
        }));
      }
    } catch (err) {
      this.logger.error(`Etherscan fetch failed on ${network.name}: ${err.message}`);
    }

    return [];
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
