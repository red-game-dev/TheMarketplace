import useSWRImmutable from 'swr/immutable';
import { EndpointsKeys } from '@/services/api';
import { getNFTs, getTransactionStatus, transferNFT, updateTransactionStatus } from './index';
import {
  GetNFTsPathParams,
  GetNFTsQueryParams,
  GetTransactionStatusPathParams,
  TransferNFTPathParams,
  TransferNFTRequest,
  UpdateTransactionStatusPathParams,
  UpdateTransactionStatusRequest,
} from '@/types/api/nft';

export const useGetNFTs = (urlPathParams: GetNFTsPathParams, queryParams?: GetNFTsQueryParams) => {
  return useSWRImmutable(
    `${EndpointsKeys.getNFTs}-${JSON.stringify(urlPathParams)}-${JSON.stringify(queryParams)}`,
    () => getNFTs(urlPathParams, queryParams),
  );
};

export const useGetTransactionStatus = (urlPathParams: GetTransactionStatusPathParams) => {
  return useSWRImmutable(
    `${EndpointsKeys.getTransactionStatus}-${JSON.stringify(urlPathParams)}`,
    () => getTransactionStatus(urlPathParams),
    {
      isPaused: () => !urlPathParams.id,
    },
  );
};

export const useTransferNFT = () => {
  const transfer = async (urlPathParams: TransferNFTPathParams, body: TransferNFTRequest) => {
    return transferNFT(urlPathParams, body);
  };

  const updateStatus = async (
    urlPathParams: UpdateTransactionStatusPathParams,
    body: UpdateTransactionStatusRequest,
  ) => {
    return updateTransactionStatus(urlPathParams, body);
  };

  return {
    transfer,
    updateStatus,
  };
};
