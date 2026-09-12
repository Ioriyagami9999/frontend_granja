import { apiClient } from './client';
import type { Role } from './types';

export interface CreateRoleInput {
  nombre: string;
  descripcion?: string;
  permissionIds: string[];
}

export async function fetchRoles(): Promise<Role[]> {
  const { data } = await apiClient.get<Role[]>('/roles');
  return data;
}

export async function createRole(input: CreateRoleInput): Promise<Role> {
  const { data } = await apiClient.post<Role>('/roles', input);
  return data;
}

export async function updateRolePermissions(roleId: string, permissionIds: string[]): Promise<Role> {
  const { data } = await apiClient.patch<Role>(`/roles/${roleId}/permissions`, { permissionIds });
  return data;
}
