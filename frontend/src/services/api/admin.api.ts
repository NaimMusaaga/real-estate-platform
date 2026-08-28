import apiClient from './apiClient';
import type { AdminStats, AdminUserSummary, AuditLogEntry } from '../../types/admin.types';

export async function getStats(): Promise<AdminStats> {
  const { data } = await apiClient.get<AdminStats>('/admin/stats');
  return data;
}

export async function listUsers(): Promise<AdminUserSummary[]> {
  const { data } = await apiClient.get<AdminUserSummary[]>('/admin/users');
  return data;
}

export async function suspendUser(id: string, reason: string): Promise<void> {
  await apiClient.patch(`/admin/users/${id}/suspend`, { reason });
}

export async function reinstateUser(id: string): Promise<void> {
  await apiClient.patch(`/admin/users/${id}/reinstate`);
}

export async function listAuditLogs(): Promise<AuditLogEntry[]> {
  const { data } = await apiClient.get<AuditLogEntry[]>('/admin/audit-logs');
  return data;
}
