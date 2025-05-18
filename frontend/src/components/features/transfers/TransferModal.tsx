'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { useToast } from '@/hooks/useToast';
import { Loader2 } from 'lucide-react';
import { TransactionStatus } from '@/components/features/transfers/TransactionStatus';
import { useAppStore } from '@/store';
import { useWallet } from '@/providers/WalletProvider';
import { NFT } from '@/types/nft';
import { getUserProfileByUsername } from '@/services/api/userProfile';
import { debounce } from '@/utils/performance/debounce';
import { useNftTransfer } from '@/hooks/useNftTransfer';

interface TransferModalProps {
  nft: NFT;
  isOpen: boolean;
  onClose: () => void;
  onTransferComplete: () => void;
}

export const TransferModal = memo(function TransferModal({
  nft,
  isOpen,
  onClose,
  onTransferComplete,
}: TransferModalProps) {
  const { address } = useWallet();
  const { toast } = useToast();
  const [recipientUsername, setRecipientUsername] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showTransactionStatus, setShowTransactionStatus] = useState(false);

  const activeTransfer = useAppStore().use.activeTransfer();
  const isTransferring = useAppStore().use.isTransferring();
  const transferStatus = useAppStore().use.transferStatus();
  const transferStatusType = useAppStore().use.transferStatusType();
  const { resetTransfer } = useAppStore().getState();
  const { handleTransfer } = useNftTransfer(nft, recipientAddress, () => {
    setShowTransactionStatus(true);
    onTransferComplete();
  });

  useEffect(() => {
    if (!isOpen) {
      resetTransfer();
      setRecipientUsername('');
      setRecipientAddress('');
      setShowTransactionStatus(false);
    }
  }, [isOpen, resetTransfer]);

  const validateUsername = useCallback(
    debounce(async (username: string) => {
      if (!username) {
        setRecipientAddress('');
        setIsValidating(false);
        return;
      }

      setIsValidating(true);
      try {
        const response = await getUserProfileByUsername({ username });

        if (response?.wallet_address) {
          setRecipientUsername(response.username || '');
          setRecipientAddress(response.wallet_address);
        } else {
          setRecipientAddress('');
        }
      } catch (error) {
        console.error('Error validating username:', error);
        toast({
          title: 'Error',
          description: 'Username not found',
          variant: 'destructive',
        });
        setRecipientAddress('');
      } finally {
        setIsValidating(false);
      }
    }, 500),
    [toast],
  );

  useEffect(() => {
    validateUsername(recipientUsername);
  }, [recipientUsername, validateUsername]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer NFT</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-4">
            <div className="rounded-lg bg-secondary/20 p-4">
              <h3 className="font-medium text-foreground">{nft?.metadata?.name || 'NFT'}</h3>
              <p className="text-sm text-muted-foreground">Token ID: {nft?.tokenId}</p>
              <p className="text-sm text-muted-foreground">Type: {nft?.tokenType}</p>
            </div>

            <div className="form-group">
              <label className="mb-1 block text-sm font-medium text-foreground">
                Recipient Username
              </label>
              <input
                type="text"
                value={recipientUsername}
                onChange={e => setRecipientUsername(e.target.value)}
                className="input w-full"
                placeholder="Enter username"
                disabled={isTransferring}
              />
              {isValidating && (
                <p className="mt-1 flex items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating username...
                </p>
              )}
              {recipientAddress && <p className="mt-1 text-sm text-success">Recipient found!</p>}
            </div>

            {transferStatus && (
              <div
                className={`text-sm text-${transferStatusType} animate-fade-in flex items-center`}
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {transferStatus}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={onClose}
                className="button button-secondary"
                disabled={isTransferring}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!address) {
                    console.error('Error checking if address is available:', address);
                    toast({
                      title: 'Walet not connected',
                      description:
                        "Seems like you haven't connected your wallet. Please connect it to continue.",
                      variant: 'default',
                    });

                    return;
                  }

                  handleTransfer(address);
                }}
                disabled={isTransferring || !recipientAddress}
                className="button button-primary flex items-center"
              >
                {isTransferring ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Transfer NFT'
                )}
              </button>
            </div>

            {activeTransfer && (
              <TransactionStatus
                transferId={activeTransfer.id}
                isOpen={showTransactionStatus}
                onClose={() => {
                  setShowTransactionStatus(false);
                  resetTransfer();
                }}
                onComplete={onTransferComplete}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});
