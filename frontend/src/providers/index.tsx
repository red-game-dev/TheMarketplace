'use client';

import { PropsWithChildren, Suspense, useEffect } from 'react';
import { WalletProvider } from './WalletProvider';
import { AppStoreProvider } from './store';
import { NetworkType } from '@/types/network';
import { useNetworks } from '@/hooks/useNetworks';

const NetworkInitializer = () => {
  const { fetchNetworks } = useNetworks();

  useEffect(() => {
    const initNetworks = async () => {
      const savedMode = localStorage.getItem('network_mode') as NetworkType | null;

      await fetchNetworks(savedMode || undefined);
    };

    initNetworks();
  }, [fetchNetworks]);

  return null;
};

export function Providers({ children }: PropsWithChildren) {
  return (
    <Suspense>
      <AppStoreProvider>
        <NetworkInitializer />
        <WalletProvider>{children}</WalletProvider>
      </AppStoreProvider>
    </Suspense>
  );
}
