import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NftService } from './services/nft.service';
import { WalletAuthGuard } from 'src/common/guards/wallet-auth.guard';
import { TransferNFTDto, UpdateTransactionDto } from './dto/nft.dto';
import { PaginationDto } from './dto/pagination.dto';
import { User } from 'src/common/decorators/user.decorator';
import { RateLimitGuard } from 'src/common/guards/rate-limit.guard';
import { RateLimit } from 'src/common/decorators/rate-limit.decorator';
import { NetworkService } from 'src/features/networks/services/network.service';

@ApiTags('NFTs')
@Controller('nfts')
@UseGuards(WalletAuthGuard)
export class NftController {
  constructor(
    private readonly nftService: NftService,
    private readonly networkService: NetworkService,
  ) {}

  @Get(':chainId/:walletAddress/')
  @ApiOperation({ summary: 'Get NFTs for a wallet address' })
  @ApiResponse({ status: 200, description: 'Returns NFTs with pagination' })
  @UseGuards(RateLimitGuard)
  @RateLimit({ limiterType: 'nft' })
  async getNFTs(
    @Param('walletAddress') walletAddress: string,
    @Query() paginationDto: PaginationDto,
    @Param('chainId') chainId?: number,
  ) {
    return this.nftService.getNFTs(
      walletAddress,
      paginationDto,
      chainId ? Number(chainId) : undefined,
    );
  }

  @Get(':walletAddress/:contractAddress/:tokenId/:chainId/verify')
  @ApiOperation({ summary: 'Verify NFT ownership' })
  @ApiResponse({ status: 200, description: 'Returns ownership status' })
  @UseGuards(RateLimitGuard)
  @RateLimit({ limiterType: 'nft:transfer' })
  async verifyOwnership(
    @Param('walletAddress') walletAddress: string,
    @Param('contractAddress') contractAddress: string,
    @Param('tokenId') tokenId: string,
    @Param('chainId') chainId: number,
  ) {
    return {
      isOwner: await this.nftService.verifyNFTOwnership(
        walletAddress,
        contractAddress,
        tokenId,
        chainId,
      ),
    };
  }

  @Post('transfer/:walletAddress')
  @ApiOperation({ summary: 'Transfer an NFT' })
  @ApiResponse({ status: 201, description: 'NFT transfer initiated' })
  @UseGuards(RateLimitGuard)
  @RateLimit({ limiterType: 'nft' })
  async transferNFT(
    @Param('walletAddress') walletAddress: string,
    @Body() transferDto: TransferNFTDto,
    @User() user: any,
  ) {
    if (user.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new UnauthorizedException('You can only transfer NFTs from your own wallet');
    }

    const result = await this.nftService.transferNFT(
      walletAddress,
      transferDto.recipient,
      transferDto.contractAddress,
      transferDto.tokenId,
      transferDto.tokenType,
      transferDto.chainId,
    );

    return {
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get('transaction/:id')
  @ApiOperation({ summary: 'Get transaction status' })
  @ApiResponse({ status: 200, description: 'Returns transaction details' })
  @UseGuards(RateLimitGuard)
  @RateLimit({ limiterType: 'nft' })
  async getTransactionStatus(@Param('id', ParseUUIDPipe) transactionId: string) {
    return this.nftService.getTransactionStatus(transactionId);
  }

  @Put('transaction/:id')
  @ApiOperation({ summary: 'Update transaction status' })
  @ApiResponse({ status: 200, description: 'Transaction status updated' })
  @UseGuards(RateLimitGuard)
  @RateLimit({ limiterType: 'nft' })
  async updateTransactionStatus(
    @Param('id', ParseUUIDPipe) transactionId: string,
    @Body() updateDto: UpdateTransactionDto,
  ) {
    return this.nftService.updateTransactionStatus(transactionId, updateDto);
  }
}
