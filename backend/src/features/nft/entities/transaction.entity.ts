import { IsString, IsEthereumAddress } from 'class-validator';
import { ChainId } from 'src/core/config/networks';

export class TransferNftDto {
  @IsEthereumAddress()
  recipientAddress: string;

  @IsString()
  contractAddress: string;

  @IsString()
  tokenId: string;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  contractAddress: string;
  tokenId: string;
  chainId?: ChainId;
  networkName?: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  createdAt: Date;
  updatedAt: Date;
}
