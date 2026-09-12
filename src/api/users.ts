import { apiClient } from './client';
import type { AppUser } from './types';

export interface CreateUserInput {
  email: string;
  password: string;
  nombre: string;
  roleId: string;
}

export async function fetchUsers(): Promise<AppUser[]> {
  const { data } = await apiClient.get<AppUser[]>('/users');
  return data;
}

export async function createUser(input: CreateUserInput): Promise<AppUser> {
  const { data } = await apiClient.post<AppUser>('/users', input);
  return data;
}

export async function updateUserRole(userId: string, roleId: string): Promise<AppUser> {
  const { data } = await apiClient.patch<AppUser>(`/users/${userId}/role`, { roleId });
  return data;
}
