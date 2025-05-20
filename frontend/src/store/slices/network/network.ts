import { StateCreator } from 'zustand';
import { createComputed } from 'zustand-computed';
import { GlobalStore } from '@/store/types';
import { type NetworkConfig, NetworkType } from '@/types/network';
import { getNetworks } from '@/services/api/networks';
import { getAppStore } from '@/providers/store';

export interface NetworkState {
  networks: NetworkConfig[];
  selectedNetwork: NetworkConfig | null;
  networkMode: NetworkType;
  isLoadingNetworks: boolean;
}

export type NetworkComputed = {
  hasNetworks: boolean;
  isTestnetMode: boolean;
};

const computed = createComputed<NetworkState, NetworkComputed>(state => ({
  hasNetworks: state.networks.length > 0,
  isTestnetMode: state.networkMode === NetworkType.TESTNET,
}));

export interface NetworkActions {
  setNetworks: (networks: NetworkConfig[]) => void;
  setSelectedNetwork: (network: NetworkConfig) => void;
  setNetworkMode: (mode: NetworkType) => void;
  fetchNetworks: (mode?: NetworkType) => Promise<void>;
  clearNetworks: () => void;
}

export type NetworkSlice = NetworkState & NetworkComputed & NetworkActions;

export const defaultNetworkState: NetworkState = {
  networks: [],
  networkMode: NetworkType.MAINNET,
  selectedNetwork: null,
  isLoadingNetworks: false,
};

export const createNetworkState: StateCreator<
  GlobalStore,
  [['zustand/devtools', never], ['chrisvander/zustand-computed', NetworkComputed]],
  [['chrisvander/zustand-computed', NetworkComputed]],
  NetworkSlice
> = computed((set, get) => ({
  ...defaultNetworkState,

  setNetworks: (networks: NetworkConfig[]) => {
    const currentSelectedChainId = get().selectedNetwork?.chainId;
    let newSelectedNetwork = networks.length > 0 ? networks[0] : null;

    if (currentSelectedChainId) {
      const existingNetwork = networks.find(n => n.chainId === currentSelectedChainId);
      if (existingNetwork) {
        newSelectedNetwork = existingNetwork;
      }
    }

    set({ networks, selectedNetwork: newSelectedNetwork });
  },

  setSelectedNetwork: (selectedNetwork: NetworkConfig) => set({ selectedNetwork }),

  setNetworkMode: (networkMode: NetworkType) => {
    localStorage.setItem('network_mode', networkMode);
    set({ networkMode });
  },

  clearNetworks: () => set({ networks: [], selectedNetwork: null }),
}));
