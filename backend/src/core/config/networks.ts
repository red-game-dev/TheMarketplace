import { ConfigService } from '@nestjs/config';

export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export enum ChainId {
  // Mainnets
  ETHEREUM = 1,
  POLYGON = 137,
  ARBITRUM = 42161,
  OPTIMISM = 10,
  BASE = 8453,
  SOLANA = 999999, // Using high number as Solana doesn't use EVM chain ID
  AVALANCHE = 43114,
  BINANCE = 56,
  CRONOS = 25,
  HARMONY = 1666600000,

  // Testnets
  SEPOLIA = 11155111, // Ethereum testnet that replaced Goerli
  ARBITRUM_SEPOLIA = 421614,
  OPTIMISM_SEPOLIA = 11155420,
  BASE_SEPOLIA = 84532,
  POLYGON_AMOY = 80002, // New Polygon testnet
  AVALANCHE_FUJI = 43113,
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
  isEVM?: boolean;
}

export type NetWorkConfigList = Record<ChainId, Partial<NetworkConfig>>;

export const ALCHEMY_NETWORKS: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: 'eth-mainnet',
  [ChainId.POLYGON]: 'polygon-mainnet',
  [ChainId.ARBITRUM]: 'arb-mainnet',
  [ChainId.OPTIMISM]: 'opt-mainnet',
  [ChainId.BASE]: 'base-mainnet',
  [ChainId.SEPOLIA]: 'eth-sepolia',
  [ChainId.POLYGON_AMOY]: 'polygon-amoy',
  [ChainId.ARBITRUM_SEPOLIA]: 'arb-sepolia',
  [ChainId.OPTIMISM_SEPOLIA]: 'opt-sepolia',
  [ChainId.BASE_SEPOLIA]: 'base-sepolia',

  // Not supported by Alchemy
  [ChainId.SOLANA]: '',
  [ChainId.AVALANCHE]: 'undfined',
  [ChainId.BINANCE]: '',
  [ChainId.CRONOS]: '',
  [ChainId.HARMONY]: '',
  [ChainId.AVALANCHE_FUJI]: '',
};

export const getNetworkConfigs = (configService: ConfigService): NetWorkConfigList => {
  return {
    // MAINNETS
    [ChainId.ETHEREUM]: {
      name: 'Ethereum',
      chainId: ChainId.ETHEREUM,
      type: NetworkType.MAINNET,
      rpcUrl: configService.get<string>('ETHEREUM_RPC_URL', 'https://eth.llamarpc.com'),
      scanUrl: 'https://api.etherscan.io',
      scanApiKey: configService.get<string>('ETHEREUM_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api.etherscan.io/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'ETH',
      decimals: 18,
      blockExplorer: 'https://etherscan.io',
      logoUrl: '/networks/ethereum.svg',
      isEVM: true,
    },
    [ChainId.POLYGON]: {
      name: 'Polygon',
      chainId: ChainId.POLYGON,
      type: NetworkType.MAINNET,
      rpcUrl: configService.get<string>('POLYGON_RPC_URL', 'https://polygon-rpc.com'),
      scanUrl: 'https://api.polygonscan.com',
      scanApiKey: configService.get<string>('POLYGON_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api.polygonscan.com/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'MATIC',
      decimals: 18,
      blockExplorer: 'https://polygonscan.com',
      logoUrl: '/networks/polygon.svg',
      isEVM: true,
    },
    [ChainId.ARBITRUM]: {
      name: 'Arbitrum One',
      chainId: ChainId.ARBITRUM,
      type: NetworkType.MAINNET,
      rpcUrl: configService.get<string>('ARBITRUM_RPC_URL', 'https://arb1.arbitrum.io/rpc'),
      scanUrl: 'https://api.arbiscan.io',
      scanApiKey: configService.get<string>('ARBITRUM_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api.arbiscan.io/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'ETH',
      decimals: 18,
      blockExplorer: 'https://arbiscan.io',
      logoUrl: '/networks/arbitrum.svg',
      isEVM: true,
    },
    [ChainId.OPTIMISM]: {
      name: 'Optimism',
      chainId: ChainId.OPTIMISM,
      type: NetworkType.MAINNET,
      rpcUrl: configService.get<string>('OPTIMISM_RPC_URL', 'https://mainnet.optimism.io'),
      scanUrl: 'https://api-optimistic.etherscan.io',
      scanApiKey: configService.get<string>('OPTIMISM_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api-optimistic.etherscan.io/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'ETH',
      decimals: 18,
      blockExplorer: 'https://optimistic.etherscan.io',
      logoUrl: '/networks/optimism.svg',
      isEVM: true,
    },
    [ChainId.BASE]: {
      name: 'Base',
      chainId: ChainId.BASE,
      type: NetworkType.MAINNET,
      rpcUrl: configService.get<string>('BASE_RPC_URL', 'https://mainnet.base.org'),
      scanUrl: 'https://api.basescan.org',
      scanApiKey: configService.get<string>('BASE_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api.basescan.org/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'ETH',
      decimals: 18,
      blockExplorer: 'https://basescan.org',
      logoUrl: '/networks/base.svg',
      isEVM: true,
    },
    [ChainId.AVALANCHE]: {
      name: 'Avalanche',
      chainId: ChainId.AVALANCHE,
      type: NetworkType.MAINNET,
      rpcUrl: configService.get<string>(
        'AVALANCHE_RPC_URL',
        'https://api.avax.network/ext/bc/C/rpc',
      ),
      scanUrl: 'https://api.snowtrace.io',
      scanApiKey: configService.get<string>('AVALANCHE_SCAN_API_KEY', ''),
      scanApiEndpoint:
        'https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api?module=account&action=addresstokennftbalance',
      nftApiPath: '',
      currency: 'AVAX',
      decimals: 18,
      blockExplorer: 'https://snowtrace.io',
      logoUrl: '/networks/avalanche.svg',
      isEVM: true,
    },
    [ChainId.BINANCE]: {
      name: 'BNB Chain',
      chainId: ChainId.BINANCE,
      type: NetworkType.MAINNET,
      rpcUrl: configService.get<string>('BINANCE_RPC_URL', 'https://bsc-dataseed.binance.org'),
      scanUrl: 'https://api.bscscan.com',
      scanApiKey: configService.get<string>('BINANCE_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api.bscscan.com/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'BNB',
      decimals: 18,
      blockExplorer: 'https://bscscan.com',
      logoUrl: '/networks/binance.svg',
      isEVM: true,
    },
    [ChainId.CRONOS]: {
      name: 'Cronos',
      chainId: ChainId.CRONOS,
      type: NetworkType.MAINNET,
      rpcUrl: configService.get<string>('CRONOS_RPC_URL', 'https://evm.cronos.org'),
      scanUrl: 'https://api.cronoscan.com',
      scanApiKey: configService.get<string>('CRONOS_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api.cronoscan.com/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'CRO',
      decimals: 18,
      blockExplorer: 'https://cronoscan.com',
      logoUrl: '/networks/cronos.svg',
      isEVM: true,
    },
    [ChainId.HARMONY]: {
      name: 'Harmony',
      chainId: ChainId.HARMONY,
      type: NetworkType.MAINNET,
      rpcUrl: configService.get<string>('HARMONY_RPC_URL', 'https://api.harmony.one'),
      scanUrl: 'https://api.explorer.harmony.one',
      scanApiKey: configService.get<string>('HARMONY_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api.explorer.harmony.one',
      nftApiPath: 'account/tokennfttx',
      currency: 'ONE',
      decimals: 18,
      blockExplorer: 'https://explorer.harmony.one',
      logoUrl: '/networks/harmony.svg',
      isEVM: true,
    },
    [ChainId.SOLANA]: {
      name: 'Solana',
      chainId: ChainId.SOLANA,
      type: NetworkType.MAINNET,
      rpcUrl: configService.get<string>('SOLANA_RPC_URL', 'https://api.mainnet-beta.solana.com'),
      scanUrl: 'https://api.solscan.io',
      scanApiKey: configService.get<string>('SOLANA_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api.solscan.io',
      nftApiPath: 'account/tokens',
      currency: 'SOL',
      decimals: 9,
      blockExplorer: 'https://solscan.io',
      logoUrl: '/networks/solana.svg',
      isEVM: false,
    },

    // TESTNETS
    [ChainId.SEPOLIA]: {
      name: 'Sepolia Testnet',
      chainId: ChainId.SEPOLIA,
      type: NetworkType.TESTNET,
      rpcUrl: configService.get<string>('SEPOLIA_RPC_URL', 'https://rpc.sepolia.org'),
      scanUrl: 'https://api-sepolia.etherscan.io',
      scanApiKey: configService.get<string>('ETHEREUM_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api-sepolia.etherscan.io/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'ETH',
      decimals: 18,
      blockExplorer: 'https://sepolia.etherscan.io',
      logoUrl: '/networks/ethereum-testnet.svg',
      isEVM: true,
    },
    [ChainId.ARBITRUM_SEPOLIA]: {
      name: 'Arbitrum Sepolia',
      chainId: ChainId.ARBITRUM_SEPOLIA,
      type: NetworkType.TESTNET,
      rpcUrl: configService.get<string>(
        'ARBITRUM_SEPOLIA_RPC_URL',
        'https://sepolia-rollup.arbitrum.io/rpc',
      ),
      scanUrl: 'https://api-sepolia.arbiscan.io',
      scanApiKey: configService.get<string>('ARBITRUM_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api-sepolia.arbiscan.io/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'ETH',
      decimals: 18,
      blockExplorer: 'https://sepolia.arbiscan.io',
      logoUrl: '/networks/arbitrum-testnet.svg',
      isEVM: true,
    },
    [ChainId.OPTIMISM_SEPOLIA]: {
      name: 'Optimism Sepolia',
      chainId: ChainId.OPTIMISM_SEPOLIA,
      type: NetworkType.TESTNET,
      rpcUrl: configService.get<string>('OPTIMISM_SEPOLIA_RPC_URL', 'https://sepolia.optimism.io'),
      scanUrl: 'https://api-sepolia-optimistic.etherscan.io',
      scanApiKey: configService.get<string>('OPTIMISM_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api-sepolia-optimistic.etherscan.io/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'ETH',
      decimals: 18,
      blockExplorer: 'https://sepolia-optimistic.etherscan.io',
      logoUrl: '/networks/optimism-testnet.svg',
      isEVM: true,
    },
    [ChainId.BASE_SEPOLIA]: {
      name: 'Base Sepolia',
      chainId: ChainId.BASE_SEPOLIA,
      type: NetworkType.TESTNET,
      rpcUrl: configService.get<string>('BASE_SEPOLIA_RPC_URL', 'https://sepolia.base.org'),
      scanUrl: 'https://api-sepolia.basescan.org',
      scanApiKey: configService.get<string>('BASE_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api-sepolia.basescan.org/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'ETH',
      decimals: 18,
      blockExplorer: 'https://sepolia.basescan.org',
      logoUrl: '/networks/base-testnet.svg',
      isEVM: true,
    },
    [ChainId.POLYGON_AMOY]: {
      name: 'Polygon Amoy',
      chainId: ChainId.POLYGON_AMOY,
      type: NetworkType.TESTNET,
      rpcUrl: configService.get<string>(
        'POLYGON_AMOY_RPC_URL',
        'https://rpc-amoy.polygon.technology',
      ),
      scanUrl: 'https://api-amoy.polygonscan.com',
      scanApiKey: configService.get<string>('POLYGON_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api-amoy.polygonscan.com/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'MATIC',
      decimals: 18,
      blockExplorer: 'https://amoy.polygonscan.com',
      logoUrl: '/networks/polygon-testnet.svg',
      isEVM: true,
    },
    [ChainId.AVALANCHE_FUJI]: {
      name: 'Avalanche Fuji',
      chainId: ChainId.AVALANCHE_FUJI,
      type: NetworkType.TESTNET,
      rpcUrl: configService.get<string>(
        'AVALANCHE_FUJI_RPC_URL',
        'https://api.avax-test.network/ext/bc/C/rpc',
      ),
      scanUrl: 'https://api-testnet.snowtrace.io',
      scanApiKey: configService.get<string>('AVALANCHE_SCAN_API_KEY', ''),
      scanApiEndpoint: 'https://api-testnet.snowtrace.io/api',
      nftApiPath: 'account/tokennfttx',
      currency: 'AVAX',
      decimals: 18,
      blockExplorer: 'https://testnet.snowtrace.io',
      logoUrl: '/networks/avalanche-testnet.svg',
      isEVM: true,
    },
  };
};
