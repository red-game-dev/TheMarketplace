import { api } from '@/services/api';
import { GetNetworkPathParams } from '@/types/api/network';
import { NetworkConfig } from '@/types/network';

export async function getNetworks(urlPathParams: GetNetworkPathParams): Promise<NetworkConfig[]> {
  const { data } = await api.getNetworks({
    urlPathParams,
  });

  return data.data;
}
