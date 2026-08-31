import apiClient from './apiClient';
import type { PublicStats } from '../../types/stats.types';

export async function getPublicStats(): Promise<PublicStats> {
  const { data } = await apiClient.get<PublicStats>('/stats/public');
  return data;
}
