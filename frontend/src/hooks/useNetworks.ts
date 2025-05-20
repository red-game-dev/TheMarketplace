import { useState, useCallback } from 'react';
import { getNetworks } from '@/services/api/networks';
import { NetworkType } from '@/types/network';
import { useAppStore } from '@/store';

export function useNetworks() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { setNetworks, setNetworkMode } = useAppStore().getState();
  const networkMode = useAppStore().use.networkMode();

  const fetchNetworks = useCallback(
    async (mode?: NetworkType) => {
      const currentMode = mode || networkMode;
      setIsLoading(true);
      setError(null);

      try {
        const networks = await getNetworks({ mode: currentMode });
        setNetworks(networks);
        return networks;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Failed to fetch networks');
        setError(errorObj);
        console.error('Failed to fetch networks:', err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [networkMode, setNetworks],
  );

  const changeNetworkMode = useCallback(
    async (newMode: NetworkType) => {
      setNetworkMode(newMode);
      return fetchNetworks(newMode);
    },
    [fetchNetworks, setNetworkMode],
  );

  return {
    isLoading,
    error,
    fetchNetworks,
    changeNetworkMode,
  };
}
