import { ChainId } from '@/types/network';

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
  tokenType: 'ERC721' | 'ERC1155';
  metadata: NFTMetadata;
  chainId: ChainId;
}
