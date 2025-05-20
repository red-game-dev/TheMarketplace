import { ErrorState, ErrorSlice } from '@/store/slices/error';
import { UserProfileSlice, UserProfileState } from '@/store/slices/user/userProfile';
import { NFTSlice, NFTState } from '@/store/slices/nft/nft';
import { TransactionSlice, TransactionState } from '@/store/slices/transaction/transaction';
import { NetworkSlice, NetworkState } from '@/store/slices/network/network';

/**
 * The global store state.
 */
export type StoreState = ErrorState & UserProfileState & NFTState & TransactionState & NetworkState;

/**
 * The global store.
 */
export type GlobalStore = ErrorSlice &
  UserProfileSlice &
  NFTSlice &
  TransactionSlice &
  NetworkSlice;
