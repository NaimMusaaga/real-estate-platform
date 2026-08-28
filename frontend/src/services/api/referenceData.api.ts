import apiClient from './apiClient';
import type { City, Governorate } from '../../types/listing.types';

export async function getGovernorates(): Promise<Governorate[]> {
  const { data } = await apiClient.get<Governorate[]>('/governorates');
  return data;
}

export async function getCities(governorateId: number | string): Promise<City[]> {
  const { data } = await apiClient.get<City[]>(`/governorates/${governorateId}/cities`);
  return data;
}
