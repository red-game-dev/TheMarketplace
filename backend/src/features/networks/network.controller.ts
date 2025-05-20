import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { NetworkType } from 'src/core/config/networks';
import { NetworkService } from 'src/features/networks/services/network.service';

@ApiTags('NETWORKS')
@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Get('list/:mode')
  @ApiOperation({ summary: 'Get available networks' })
  @ApiQuery({ name: 'mode', enum: NetworkType, required: false })
  @ApiResponse({ status: 200, description: 'Returns list of networks' })
  getNetworks(@Param('mode') mode?: NetworkType) {
    const networkType = mode === NetworkType.MAINNET ? NetworkType.MAINNET : NetworkType.TESTNET;
    const networks =
      networkType === NetworkType.MAINNET
        ? this.networkService.getMainnetNetworks()
        : this.networkService.getTestnetNetworks();

    return {
      data: networks,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
