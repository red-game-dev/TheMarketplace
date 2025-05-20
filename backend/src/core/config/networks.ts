import { ConfigService } from '@nestjs/config';

export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export enum ChainId {
  ETHEREUM = 1,
  POLYGON = 137,
  ARBITRUM = 42161,
  OPTIMISM = 10,
  // Testnets
  GOERLI = 5,
  MUMBAI = 80001,
}

export interface NetworkConfig {
  name: string;
  chainId: ChainId;
  type: NetworkType;
  rpcUrl: string;
  scanUrl: string;
  scanApiKey: string;
  scanApiEndpoint: string;
  nftApiPath: string;
  currency: string;
  decimals: number;
  blockExplorer: string;
  logoUrl: string;
}

export type NetWorkConfigList = Record<ChainId, Partial<NetworkConfig>>;

export const getNetworkConfigs = (configService: ConfigService): NetWorkConfigList => {
  return {
    [ChainId.ETHEREUM]: {
      name: 'Ethereum',
      chainId: ChainId.ETHEREUM,
      type: NetworkType.MAINNET,
      rpcUrl: configService.get<string>('ETHEREUM_RPC_URL', ''),
      scanUrl: 'https://api.etherscan.io',
      scanApiKey: configService.get<string>('ETHEREUM_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api.etherscan.io/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'ETH',
      decimals: 18,
      blockExplorer: 'https://etherscan.io',
      logoUrl: '/networks/ethereum.svg',
    },
    [ChainId.POLYGON]: {
      name: 'Polygon',
      chainId: ChainId.POLYGON,
      type: NetworkType.MAINNET,
      rpcUrl: configService.get<string>('POLYGON_RPC_URL', ''),
      scanUrl: 'https://api.polygonscan.com',
      scanApiKey: configService.get<string>('POLYGON_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api.polygonscan.com/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'MATIC',
      decimals: 18,
      blockExplorer: 'https://polygonscan.com',
      logoUrl: '/networks/polygon.svg',
    },
    [ChainId.ARBITRUM]: {
      name: 'Arbitrum One',
      chainId: ChainId.ARBITRUM,
      type: NetworkType.MAINNET,
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      scanUrl: 'https://arbiscan.io',
      scanApiKey: configService.get<string>('ARBITRUM_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://arb1.arbitrum.io/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'ETH',
      decimals: 18,
      blockExplorer: 'https://arbiscan.io/',
      logoUrl: '/networks/arbitrum.svg',
    },
    [ChainId.OPTIMISM]: {
      name: 'Optimism',
      chainId: ChainId.OPTIMISM,
      type: NetworkType.MAINNET,
      rpcUrl: 'https://mainnet.optimism.io',
      scanUrl: 'https://optimistic.etherscan.io.com',
      scanApiKey: configService.get<string>('OPTIMISM_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://optimistic.etherscan.io/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'ETH',
      decimals: 18,
      blockExplorer: 'https://optimistic.etherscan.io/',
      logoUrl: '/networks/optimism.svg',
    },
    [ChainId.MUMBAI]: {
      name: 'Mumbai Testnet',
      chainId: ChainId.MUMBAI,
      type: NetworkType.TESTNET,
      rpcUrl: configService.get<string>('MUMBAI_RPC_URL', ''),
      scanUrl: 'https://api-testnet.polygonscan.com',
      scanApiKey: configService.get<string>('POLYGON_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api-testnet.polygonscan.com/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'MATIC',
      decimals: 18,
      blockExplorer: 'https://mumbai.polygonscan.com',
      logoUrl: '/networks/polygon-testnet.svg',
    },
    [ChainId.GOERLI]: {
      name: 'Goerli Testnet',
      chainId: ChainId.GOERLI,
      type: NetworkType.TESTNET,
      rpcUrl: configService.get<string>('GOERLI_RPC_URL', ''),
      scanUrl: 'https://api-goerli.etherscan.io',
      scanApiKey: configService.get<string>('ETHEREUM_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api-goerli.etherscan.io/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'ETH',
      decimals: 18,
      blockExplorer: 'https://goerli.etherscan.io',
      logoUrl: '/networks/ethereum-testnet.svg',
    },
  };
};
