import { ChainId } from '@/types/network';

export const CHAIN_PARAMS = {
  [ChainId.ETHEREUM]: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [ChainId.POLYGON]: {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  [ChainId.ARBITRUM]: {
    chainId: `0x${ChainId.ARBITRUM.toString(16)}`,
    chainName: 'Arbitrum One',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io/'],
  },
  [ChainId.OPTIMISM]: {
    chainId: `0x${ChainId.OPTIMISM.toString(16)}`,
    chainName: 'Optimism',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io/'],
  },
  [ChainId.GOERLI]: {
    chainId: `0x${ChainId.GOERLI.toString(16)}`,
    chainName: 'Goerli Testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://goerli.infura.io/v3/'],
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
  },
  [ChainId.MUMBAI]: {
    chainId: `0x${ChainId.MUMBAI.toString(16)}`,
    chainName: 'Mumbai Testnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
  },
};
