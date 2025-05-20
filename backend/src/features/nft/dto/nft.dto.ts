import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEVMAddress } from 'src/common/pipes/evm-address.validator';
import { ChainId } from 'src/core/config/networks';

export enum NFTType {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

export class TransferNFTDto {
  @ApiProperty({
    description: 'Recipient wallet address or username',
    example: 'crypto_whale',
  })
  @IsString()
  recipient: string;

  @ApiProperty({
    description: 'NFT contract address on Polygon',
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  })
  @IsEVMAddress()
  contractAddress: string;

  @ApiProperty({
    description: 'Token ID of the NFT',
    example: '1234',
  })
  @IsString()
  tokenId: string;

  @ApiProperty({
    description: 'Chain ID of the NFT',
    example: '1',
  })
  @IsString()
  chainId: ChainId;

  @ApiPropertyOptional({
    description: 'Type of NFT (ERC721 or ERC1155)',
    enum: NFTType,
    default: NFTType.ERC721,
  })
  @IsEnum(NFTType)
  @IsOptional()
  tokenType?: NFTType = NFTType.ERC721;
}

export class UpdateTransactionDto {
  @ApiProperty({
    description: 'Transaction status',
    enum: ['pending', 'completed', 'failed'],
  })
  @IsEnum(['pending', 'completed', 'failed'])
  status: string;

  @ApiProperty({
    description: 'Transaction hash from the blockchain',
  })
  @IsString()
  txHash: string;

  @ApiPropertyOptional({
    description: 'Error message if the transaction failed',
  })
  @IsString()
  @IsOptional()
  error?: string;
}
