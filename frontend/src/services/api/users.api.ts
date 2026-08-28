import apiClient from './apiClient';
import type { BlockStatus } from '../../types/user.types';

export async function blockUser(userId: string): Promise<void> {
  await apiClient.post(`/users/${userId}/block`);
}

export async function unblockUser(userId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}/block`);
}

export async function getBlockStatus(userId: string): Promise<BlockStatus> {
  const { data } = await apiClient.get<BlockStatus>(`/users/${userId}/block-status`);
  return data;
}
