import React, { useCallback, useState, useEffect } from 'react';
import { useWallet } from '@/providers/WalletProvider';
import { useToast } from '@/hooks/useToast';
import { useGetNFTs } from '@/services/api/nft/hooks';
import { getNFTs } from '@/services/api/nft';
import { useAppStore } from '@/store';
import { NFT } from '@/types/nft';
import { TransferModal } from '@/components/features/transfers/TransferModal';
import { NFTCard } from '@/components/features/nfts/NFTCard';
import { VirtualizedGrid } from '@/components/ui/VirtualizedGrid';
import { NFTCardSkeleton } from '@/components/ui/progress/SkeletonLoader';
import { LoadMore } from '@/components/ui/buttons/LoadMore';

const ITEMS_PER_PAGE = 12;
const MIN_CARD_WIDTH = 350;
const CARD_HEIGHT = 520;
const GAP = 16;

export function NFTGallery() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const nfts = useAppStore().use.nfts();
  const nftListHasMore = useAppStore().use.nftListHasMore();
  const nftListOffset = useAppStore().use.nftListOffset();
  const hasNFTs = useAppStore().use.hasNFTs();
  const { clearNFTs } = useAppStore().getState();
  const selectedNetwork = useAppStore().use.selectedNetwork();

  const { isLoading, error } = useGetNFTs(
    { walletAddress: address || '', chainId: selectedNetwork?.chainId || 1 },
    { limit: ITEMS_PER_PAGE, offset: 0 },
  );

  const handleTransferClick = useCallback((nft: NFT) => {
    setSelectedNFT(nft);
    setShowTransferModal(true);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!address || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      await getNFTs(
        { walletAddress: address, chainId: selectedNetwork?.chainId || 1 },
        { limit: ITEMS_PER_PAGE, offset: nftListOffset },
      );
    } catch (error: unknown) {
      console.error('Error loading more NFTs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load more NFTs',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingMore(false);
    }
  }, [address, isLoadingMore, selectedNetwork?.chainId, nftListOffset, toast]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load NFTs',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // useEffect(() => {
  //   if (nfts.length) {
  //     clearNFTs();
  //   }
  // }, [clearNFTs, nfts.length, selectedNetwork?.chainId]);

  if (isLoading && !hasNFTs) {
    return (
      <div className="animate-fade-in grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <NFTCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to load NFTs',
      variant: 'destructive',
    });
  }

  if (!hasNFTs) {
    return (
      <div className="animate-fade-in py-12 text-center">
        <h3 className="text-lg font-medium text-foreground">No NFTs found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Once you receive NFTs, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <VirtualizedGrid
        items={nfts}
        minItemWidth={MIN_CARD_WIDTH}
        itemHeight={CARD_HEIGHT}
        gap={GAP}
        renderItem={(nft: NFT) => (
          <NFTCard
            nft={nft}
            onTransferClick={() => handleTransferClick(nft)}
            className="animate-slide-up h-full w-full"
          />
        )}
      />
      {nftListHasMore && <LoadMore isLoadingMore={isLoadingMore} handleLoadMore={handleLoadMore} />}
      {selectedNFT && (
        <TransferModal
          nft={selectedNFT}
          isOpen={showTransferModal}
          onClose={() => {
            setShowTransferModal(false);
            setSelectedNFT(null);
          }}
          onTransferComplete={() => {
            setShowTransferModal(false);
            setSelectedNFT(null);
            setTimeout(async () => {
              clearNFTs();
              await getNFTs(
                { walletAddress: address || '', chainId: selectedNetwork?.chainId || 1 },
                { limit: ITEMS_PER_PAGE, offset: 0 },
              );
            }, 3000);
          }}
        />
      )}
    </>
  );
}
