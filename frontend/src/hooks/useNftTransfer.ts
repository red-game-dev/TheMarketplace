import { useCallback } from 'react';
import Web3 from 'web3';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store';
import { NFT } from '@/types/nft';
import { ERC1155_ABI, ERC721_ABI } from '@/abi';
import { useTransferNFT } from '@/services/api/nft/hooks';

export function useNftTransfer(nft: NFT, recipientAddress: string, onTransferComplete: () => void) {
  const { toast } = useToast();
  const { transfer, updateStatus } = useTransferNFT();
  const { setTransferStatus, setActiveTransfer, setTransferring } = useAppStore().getState();
  const activeTransfer = useAppStore().use.activeTransfer();

  const waitForTransaction = useCallback(async (web3: Web3, txHash: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const checkReceipt = async () => {
        try {
          const receipt = await web3.eth.getTransactionReceipt(txHash);
          if (receipt) {
            if (receipt.status) {
              resolve();
            } else {
              reject(new Error('Transaction failed'));
            }
          } else {
            setTimeout(checkReceipt, 2000);
          }
        } catch (error) {
          if (error instanceof Error && error.message.includes('Transaction not found')) {
            setTimeout(checkReceipt, 2000);
          } else {
            reject(error);
          }
        }
      };
      checkReceipt();
    });
  }, []);

  const handleTransfer = useCallback(
    async (walletAddress: string) => {
      if (!window.ethereum || !walletAddress || !recipientAddress) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet and enter a valid recipient',
          variant: 'destructive',
        });
        return;
      }

      setTransferring(true);

      try {
        const web3 = new Web3(window.ethereum);
        const abi = nft.tokenType === 'ERC721' ? ERC721_ABI : ERC1155_ABI;
        const contract = new web3.eth.Contract(abi, nft.contractAddress);

        const response = await transfer(
          { walletAddress },
          {
            recipient: recipientAddress,
            contractAddress: nft.contractAddress,
            tokenId: nft.tokenId,
            tokenType: nft.tokenType,
          },
        );

        const transferId = response.id;

        setActiveTransfer({
          id: transferId,
          fromAddress: walletAddress,
          toAddress: recipientAddress,
          contractAddress: nft.contractAddress,
          tokenId: nft.tokenId,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        setTransferStatus('Requesting approval...', 'warning');
        const approvalTx = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: walletAddress,
              to: nft.contractAddress,
              data: contract.methods.setApprovalForAll(nft.contractAddress, true).encodeABI(),
            },
          ],
        });

        setTransferStatus('Waiting for approval confirmation...', 'warning');
        await waitForTransaction(web3, approvalTx);

        setTransferStatus('Transferring NFT...', 'success');
        const transferData =
          nft.tokenType === 'ERC721'
            ? contract.methods
                .transferFrom(walletAddress, recipientAddress, nft.tokenId)
                .encodeABI()
            : contract.methods
                .safeTransferFrom(walletAddress, recipientAddress, nft.tokenId, 1, '0x')
                .encodeABI();

        const transferTx = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: walletAddress,
              to: nft.contractAddress,
              data: transferData,
            },
          ],
        });

        setTransferStatus('Waiting for transfer confirmation...', 'warning');
        await waitForTransaction(web3, transferTx);

        await updateStatus({ id: transferId }, { status: 'completed', txHash: transferTx });
        onTransferComplete();
      } catch (error) {
        console.error('Transfer error:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to transfer NFT',
          variant: 'destructive',
        });

        if (activeTransfer?.id) {
          await updateStatus(
            { id: activeTransfer.id },
            {
              status: 'failed',
              error: error instanceof Error ? error.message : 'Unknown error occurred',
            },
          );
          setTransferStatus('Unable to transfer', 'error');
        }
      } finally {
        setTransferring(false);
      }
    },
    [
      toast,
      transfer,
      updateStatus,
      nft,
      recipientAddress,
      waitForTransaction,
      setTransferStatus,
      setActiveTransfer,
      setTransferring,
      onTransferComplete,
      activeTransfer,
    ],
  );

  return { handleTransfer };
}
