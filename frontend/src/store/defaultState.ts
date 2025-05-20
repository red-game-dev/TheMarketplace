import { defaultInitState as defaultErrorState } from '@/store/slices/error';
import { defaultInitState as defaultUserProfileState } from '@/store/slices/user/userProfile';
import { defaultInitState as defaultNftState } from '@/store/slices/nft/nft';
import { defaultInitState as defaultNotificationsState } from '@/store/slices/transaction/transaction';

import { StoreState } from '@/store/types';
import { defaultNetworkState } from '@/store/slices/network/network';

/**
 * The default state for the store.
 */
export const defaultState: StoreState = {
  ...defaultErrorState,
  ...defaultNetworkState,
  ...defaultUserProfileState,
  ...defaultNftState,
  ...defaultNotificationsState,
};
