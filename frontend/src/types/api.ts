import { ChainId } from './network';

export interface ApiResponse<T, AdditionalMetaData = { [key: string]: never }> {
  data: T;
  meta?: {
    timestamp: string;
  } & AdditionalMetaData;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ApiErrorResponse<Details> {
  statusCode: number;
  message: 'Unauthorized' | 'DataValidation' | 'Conflict' | 'Not Found' | 'Internal Server Error';
  path: string;
  timestamp: Date;
  details: Details;
  error: 'Bad Request';
}

export interface WalletAuthResponse {
  token: string;
  user: {
    id: string;
    walletAddress: string;
    username: string | null;
  };
}

export type UserData = {
  id: string;
  wallet_address: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
};
export type ProfileData = UserData & {
  created_at: string;
  updated_at: string;
};

export interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface NFT {
  contractAddress: string;
  tokenId: string;
  chainId: ChainId;
  tokenType: 'ERC721' | 'ERC1155';
  metadata: NFTMetadata;
}

export interface TransactionStatus {
  id: string;
  fromAddress: string;
  toAddress: string;
  contractAddress: string;
  tokenId: string;
  chainId: ChainId;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  contract_address: string;
  created_at: Date;
  from_address: string;
  id: string;
  chainId?: ChainId;
  networkName?: string;
  status: 'pending' | 'completed' | 'failed';
  to_address: string;
  token_id: string;
  tx_hash: string;
  updated_at: string;
  nftMetadata?: {
    name: string;
    image: string;
  };
}

export type NFTsResponse = PaginatedResponse<NFT>;
export type TransactionsResponse = PaginatedResponse<Transaction>;
