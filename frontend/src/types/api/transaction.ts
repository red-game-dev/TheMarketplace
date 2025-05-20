import type { Endpoint } from 'fetchff';
import { ApiResponse, TransactionsResponse } from '@/types/api';
import { ChainId } from '@/types/network';

export interface TransactionMethods {
  /**
   * Endpoint for retrieving transaction history
   */
  getTransactions: Endpoint<
    GetTransactionsResponse,
    GetTransactionsQueryParams,
    GetTransactionsPathParams
  >;
}

export interface GetTransactionsQueryParams {
  limit?: number;
  offset?: number;
}

export interface GetTransactionsPathParams {
  walletAddress: string;
  chainId: ChainId;
}

export type GetTransactionsResponse = ApiResponse<TransactionsResponse>;
