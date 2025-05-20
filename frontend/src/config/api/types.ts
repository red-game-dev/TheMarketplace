import { endpoints } from '@/config/api/endpoints';
import { NetworknMethods } from '@/types/api/network';
import { NFTMethods } from '@/types/api/nft';
import { TransactionMethods } from '@/types/api/transaction';
import { UserMethods } from '@/types/api/userProfile';

export type EndpointsConfig = typeof endpoints;
export type EndpointNames = keyof EndpointsConfig;

export interface EndpointsMethods
  extends UserMethods,
    NFTMethods,
    TransactionMethods,
    NetworknMethods {}
