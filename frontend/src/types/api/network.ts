import type { NetworkConfig, NetworkType } from '@/types/network';
import { Endpoint, QueryParams } from 'fetchff';
import { ApiResponse } from '@/types/api';

export interface NetworknMethods {
  /**
   * Endpoint for retrieving transaction history
   */
  getNetworks: Endpoint<GetNetworknMethodsResponse, QueryParams, GetNetworkPathParams>;
}

export type GetNetworknMethodsResponse = ApiResponse<NetworkConfig[]>;
export interface GetNetworkPathParams {
  mode: NetworkType;
}
