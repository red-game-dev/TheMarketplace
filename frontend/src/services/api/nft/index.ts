import { getAppStore } from '@/providers/store';
import { api } from '@/services/api';
import { NFTsResponse, TransactionStatus } from '@/types/api';
import {
  GetNFTsPathParams,
  GetNFTsQueryParams,
  GetTransactionStatusPathParams,
  TransferNFTPathParams,
  TransferNFTRequest,
  UpdateTransactionStatusPathParams,
  UpdateTransactionStatusRequest,
} from '@/types/api/nft';

export async function getNFTs(
  urlPathParams: GetNFTsPathParams,
  queryParams?: GetNFTsQueryParams,
): Promise<NFTsResponse> {
  const { setNFTs, appendNFTs, setNFTListHasMore, setNFTListTotal, setNFTListOffset } =
    getAppStore().getState();

  const { data } = await api.getNFTs({
    urlPathParams,
    params: queryParams,
  });

  const response = data.data;

  if (queryParams?.offset === 0) {
    setNFTs(response.data);
  } else {
    appendNFTs(response.data);
  }

  setNFTListHasMore(response.hasMore);
  setNFTListTotal(response.total);
  setNFTListOffset(response.offset + response.limit);

  return response;
}

export async function getTransactionStatus(
  urlPathParams: GetTransactionStatusPathParams,
): Promise<TransactionStatus> {
  const { data } = await api.getTransactionStatus({
    urlPathParams,
  });

  const { setActiveTransfer } = getAppStore().getState();
  setActiveTransfer(data.data);

  return data.data;
}

export async function transferNFT(
  urlPathParams: TransferNFTPathParams,
  body: TransferNFTRequest,
): Promise<TransactionStatus> {
  const { setTransferring, setTransferStatus } = getAppStore().getState();

  setTransferring(true);
  setTransferStatus('Initiating transfer...', 'warning');

  try {
    const { data } = await api.transferNFT({
      urlPathParams,
      body,
    });

    const { setActiveTransfer } = getAppStore().getState();
    setActiveTransfer({
      id: data.data.id,
      status: 'pending',
      chainId: data.data.chainId,
      fromAddress: data.data.fromAddress,
      toAddress: data.data.toAddress,
      contractAddress: data.data.contractAddress,
      tokenId: data.data.tokenId,
      createdAt: data.data.createdAt,
      updatedAt: data.data.updatedAt,
    });

    return data.data;
  } finally {
    setTransferring(false);
  }
}

export async function updateTransactionStatus(
  urlPathParams: UpdateTransactionStatusPathParams,
  body: UpdateTransactionStatusRequest,
): Promise<TransactionStatus> {
  const { data } = await api.updateTransactionStatus({
    urlPathParams,
    body,
  });

  const { setActiveTransfer } = getAppStore().getState();
  setActiveTransfer(data.data);

  return data.data;
}
