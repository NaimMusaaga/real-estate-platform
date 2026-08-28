import apiClient from './apiClient';
import type { CreateReportPayload, Report, ReportStatus } from '../../types/report.types';

export async function createReport(payload: CreateReportPayload): Promise<void> {
  await apiClient.post('/reports', payload);
}

export async function listReports(status: ReportStatus = 'pending'): Promise<Report[]> {
  const { data } = await apiClient.get<Report[]>('/admin/reports', { params: { status } });
  return data;
}

export async function dismissReport(id: string, resolutionNote?: string): Promise<void> {
  await apiClient.patch(`/admin/reports/${id}/dismiss`, { resolutionNote });
}

export async function actionReport(id: string, action: 'archive' | 'remove', resolutionNote?: string): Promise<void> {
  await apiClient.patch(`/admin/reports/${id}/action`, { action, resolutionNote });
}
