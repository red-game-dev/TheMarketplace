export { useAppStore, useAppStoreHook } from '@/providers/store';

import { defaultState } from '@/store/defaultState';
import { GlobalStore, StoreState } from '@/store/types';
import { createErrorState } from '@/store/slices/error';
import { logger } from '@/utils/logger';
import { devtools } from 'zustand/middleware';
import { create } from 'zustand';
import { createUserProfileState } from '@/store/slices/user/userProfile';
import { createNFTState } from '@/store/slices/nft/nft';
import { createTransactionState } from '@/store/slices/transaction/transaction';
import { createNetworkState } from '@/store/slices/network/network';

export const initAppStore = (): StoreState => {
  return defaultState;
};

export const createAppStore = (initState: StoreState = defaultState) => {
  return create<GlobalStore>()(
    devtools(
      logger((...params) => ({
        ...initState,
        ...createNetworkState(...params),
        ...createErrorState(...params),
        ...createUserProfileState(...params),
        ...createNFTState(...params),
        ...createTransactionState(...params),
      })),
    ),
  );
};
