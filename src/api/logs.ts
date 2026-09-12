import { apiClient } from './client';
import type { PaginatedLogs } from './types';

export async function fetchLogs(page: number, pageSize: number): Promise<PaginatedLogs> {
  const { data } = await apiClient.get<PaginatedLogs>('/logs', { params: { page, pageSize } });
  return data;
}
