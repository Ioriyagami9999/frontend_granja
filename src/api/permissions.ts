import { apiClient } from './client';
import type { Permission } from './types';

export interface CreatePermissionInput {
  code: string;
  description: string;
}

export async function fetchPermissions(): Promise<Permission[]> {
  const { data } = await apiClient.get<Permission[]>('/permissions');
  return data;
}

export async function createPermission(input: CreatePermissionInput): Promise<Permission> {
  const { data } = await apiClient.post<Permission>('/permissions', input);
  return data;
}
