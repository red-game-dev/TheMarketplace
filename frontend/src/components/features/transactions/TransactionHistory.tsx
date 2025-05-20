import React, { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useGetTransactions } from '@/services/api/transaction/hooks';
import { getTransactions } from '@/services/api/transaction';
import { useAppStore } from '@/store';
import { VirtualizedGrid } from '@/components/ui/VirtualizedGrid';
import { TransactionRow } from '@/components/features/transactions/TransactionRow';
import { useWallet } from '@/providers/WalletProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadMore } from '@/components/ui/buttons/LoadMore';

const ITEMS_PER_PAGE = 10;
const ROW_HEIGHT = 120;
const FORCE_SINGLE_COLUMN = 850;

export function TransactionHistory() {
  const { toast } = useToast();
  const { address } = useWallet();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const transactions = useAppStore().use.transactions();
  const transactionListHasMore = useAppStore().use.transactionListHasMore();
  const transactionListOffset = useAppStore().use.transactionListOffset();
  const hasTransactions = useAppStore().use.hasTransactions();
  const selectedNetwork = useAppStore().use.selectedNetwork();

  const { isLoading, error } = useGetTransactions(
    { walletAddress: address || '', chainId: selectedNetwork?.chainId || 1 },
    { limit: ITEMS_PER_PAGE, offset: 0 },
  );

  const handleLoadMore = useCallback(async () => {
    if (!address || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      await getTransactions(
        { walletAddress: address || '', chainId: selectedNetwork?.chainId || 1 },
        { limit: ITEMS_PER_PAGE, offset: transactionListOffset },
      );
    } catch (error: unknown) {
      console.error('Error loading more transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load more transactions',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingMore(false);
    }
  }, [address, isLoadingMore, selectedNetwork?.chainId, transactionListOffset, toast]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load transactions',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  if (isLoading && !hasTransactions) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!hasTransactions) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium">No Transactions found</h3>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <VirtualizedGrid
          items={transactions}
          minItemWidth={FORCE_SINGLE_COLUMN}
          itemHeight={ROW_HEIGHT}
          width={`100%`}
          gap={0}
          containerHeight="60vh"
          renderItem={transaction => (
            <TransactionRow key={transaction.id} address={address || ''} tx={transaction} />
          )}
        />
        {transactionListHasMore && (
          <LoadMore handleLoadMore={handleLoadMore} isLoadingMore={isLoadingMore} />
        )}
      </CardContent>
    </Card>
  );
}
