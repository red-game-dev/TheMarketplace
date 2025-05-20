import { memo, useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { useWallet } from '@/providers/WalletProvider';
import { ChainId, NetworkType } from '@/types/network';
import { ChevronDown, CheckIcon, Loader2 } from 'lucide-react';
import { useNetworks } from '@/hooks/useNetworks';

export const NetworkSelector = memo(function NetworkSelector() {
  const { switchNetwork } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const networks = useAppStore().use.networks();
  const selectedNetwork = useAppStore().use.selectedNetwork();
  const setSelectedNetwork = useAppStore().use.setSelectedNetwork();
  const isTestnetMode = useAppStore().use.isTestnetMode();

  const { isLoading, fetchNetworks, changeNetworkMode } = useNetworks();

  useEffect(() => {
    const loadNetworks = async () => {
      const savedMode = localStorage.getItem('network_mode') as NetworkType | null;

      if (networks.length === 0) {
        await fetchNetworks(savedMode || undefined);
      }
    };

    loadNetworks();
  }, [fetchNetworks, networks.length]);

  const toggleNetworkMode = async () => {
    const newMode = isTestnetMode ? NetworkType.MAINNET : NetworkType.TESTNET;

    await changeNetworkMode(newMode);
    setIsOpen(false);
  };

  const handleNetworkSelect = async (networkId: ChainId) => {
    const network = networks.find(n => n.chainId === networkId);
    if (network) {
      setSelectedNetwork(network);
      await switchNetwork(network.chainId);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-md border border-border bg-secondary/20 px-3 py-1.5 text-sm transition-colors hover:bg-secondary/30"
        disabled={isLoading || networks.length === 0}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-muted-foreground">Loading...</span>
          </>
        ) : selectedNetwork ? (
          <>
            <span className="text-foreground">
              {selectedNetwork.name}
              {isTestnetMode && ' (Testnet)'}
            </span>
            <ChevronDown className="h-4 w-4 text-foreground" />
          </>
        ) : (
          <span>Select Network</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-md border border-border bg-background shadow-lg">
          <div className="py-1">
            <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
              {isTestnetMode ? 'Testnets' : 'Networks'}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : networks.length > 0 ? (
              networks.map(network => (
                <button
                  key={network.chainId}
                  onClick={() => handleNetworkSelect(network.chainId)}
                  className="flex w-full items-center justify-between px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
                >
                  <span>{network.name}</span>
                  {selectedNetwork?.chainId === network.chainId && (
                    <CheckIcon className="h-4 w-4 text-success" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-muted-foreground">No networks available</div>
            )}

            <div className="border-t border-border px-3 py-2">
              <button
                onClick={toggleNetworkMode}
                className="flex w-full items-center justify-between text-xs text-muted-foreground hover:text-foreground"
              >
                <span>Testnet Mode</span>
                <div
                  className={`relative h-4 w-8 rounded-full ${isTestnetMode ? 'bg-success/50' : 'bg-gray-600'} transition-colors`}
                >
                  <div
                    className={`absolute top-0.5 h-3 w-3 transform rounded-full bg-white transition-transform ${isTestnetMode ? 'translate-x-4' : 'translate-x-1'}`}
                  ></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
