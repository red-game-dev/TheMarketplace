import { ChainId } from '@/types/network';

export const CHAIN_PARAMS = {
  // MAINNETS
  [ChainId.ETHEREUM]: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [ChainId.POLYGON]: {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  [ChainId.ARBITRUM]: {
    chainId: `0x${ChainId.ARBITRUM.toString(16)}`,
    chainName: 'Arbitrum One',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  [ChainId.OPTIMISM]: {
    chainId: `0x${ChainId.OPTIMISM.toString(16)}`,
    chainName: 'Optimism',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  [ChainId.BASE]: {
    chainId: `0x${ChainId.BASE.toString(16)}`,
    chainName: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
  },
  [ChainId.AVALANCHE]: {
    chainId: `0x${ChainId.AVALANCHE.toString(16)}`,
    chainName: 'Avalanche C-Chain',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io'],
  },
  [ChainId.BINANCE]: {
    chainId: `0x${ChainId.BINANCE.toString(16)}`,
    chainName: 'BNB Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  [ChainId.CRONOS]: {
    chainId: `0x${ChainId.CRONOS.toString(16)}`,
    chainName: 'Cronos Mainnet',
    nativeCurrency: { name: 'Cronos', symbol: 'CRO', decimals: 18 },
    rpcUrls: ['https://evm.cronos.org'],
    blockExplorerUrls: ['https://cronoscan.com'],
  },
  [ChainId.HARMONY]: {
    chainId: `0x${ChainId.HARMONY.toString(16)}`,
    chainName: 'Harmony Mainnet Shard 0',
    nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
    rpcUrls: ['https://api.harmony.one'],
    blockExplorerUrls: ['https://explorer.harmony.one'],
  },

  // TESTNETS
  [ChainId.SEPOLIA]: {
    chainId: `0x${ChainId.SEPOLIA.toString(16)}`,
    chainName: 'Sepolia Testnet',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    chainId: `0x${ChainId.ARBITRUM_SEPOLIA.toString(16)}`,
    chainName: 'Arbitrum Sepolia',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://sepolia.arbiscan.io'],
  },
  [ChainId.OPTIMISM_SEPOLIA]: {
    chainId: `0x${ChainId.OPTIMISM_SEPOLIA.toString(16)}`,
    chainName: 'Optimism Sepolia',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.optimism.io'],
    blockExplorerUrls: ['https://sepolia-optimistic.etherscan.io'],
  },
  [ChainId.BASE_SEPOLIA]: {
    chainId: `0x${ChainId.BASE_SEPOLIA.toString(16)}`,
    chainName: 'Base Sepolia',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org'],
  },
  [ChainId.POLYGON_AMOY]: {
    chainId: `0x${ChainId.POLYGON_AMOY.toString(16)}`,
    chainName: 'Polygon Amoy',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://rpc-amoy.polygon.technology'],
    blockExplorerUrls: ['https://amoy.polygonscan.com'],
  },
  [ChainId.AVALANCHE_FUJI]: {
    chainId: `0x${ChainId.AVALANCHE_FUJI.toString(16)}`,
    chainName: 'Avalanche Fuji Testnet',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io'],
  },
  [ChainId.BINANCE_TESTNET]: {
    chainId: `0x${ChainId.BINANCE_TESTNET.toString(16)}`,
    chainName: 'BNB Chain Testnet',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
};

// For non-EVM chains like Solana, we need a different approach as they don't use the same wallet connection methods
export const NON_EVM_CHAINS = {
  [ChainId.SOLANA]: {
    name: 'Solana',
    endpoint: 'https://api.mainnet-beta.solana.com',
    blockExplorer: 'https://solscan.io',
  },
  [ChainId.SOLANA_DEVNET]: {
    name: 'Solana Devnet',
    endpoint: 'https://api.devnet.solana.com',
    blockExplorer: 'https://explorer.solana.com/?cluster=devnet',
  },
  [ChainId.SOLANA_TESTNET]: {
    name: 'Solana Testnet',
    endpoint: 'https://api.testnet.solana.com',
    blockExplorer: 'https://explorer.solana.com/?cluster=testnet',
  },
};