import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TransactionService } from 'src/features/transaction/services/transaction.service';
import { WalletAuthGuard } from 'src/common/guards/wallet-auth.guard';
import { PaginationDto } from 'src/features/nft/dto/pagination.dto';
import { RateLimitGuard } from 'src/common/guards/rate-limit.guard';
import { RateLimit } from 'src/common/decorators/rate-limit.decorator';
import { ChainId } from 'src/core/config/networks';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(WalletAuthGuard)
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':chainId/:walletAddress')
  @ApiOperation({ summary: 'Get transactions for a wallet' })
  @ApiResponse({
    status: 200,
    description: 'Returns transactions with pagination',
  })
  @UseGuards(RateLimitGuard)
  @RateLimit({ limiterType: 'transaction' }) // 30 requests per minute
  async getTransactions(
    @Param('walletAddress') walletAddress: string,
    @Param('chainId') chainId: ChainId,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.transactionService.getTransactionsByAddress(walletAddress, chainId, paginationDto);
  }
}
