import { ChainId } from 'src/core/config/networks';

export interface Transaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  contractAddress: string;
  tokenId: string;
  chainId?: ChainId;
  networkName?: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}
