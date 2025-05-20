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
