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
  BINANCE_TESTNET = 97,
  SOLANA_DEVNET = 999998, // Using high number as Solana doesn't use EVM chain ID
  SOLANA_TESTNET = 999997, // Using high number as Solana doesn't use EVM chain ID
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
