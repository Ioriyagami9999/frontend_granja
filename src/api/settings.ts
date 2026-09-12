import { apiClient } from './client';

export interface Settings {
  id: string;
  mapaFondoUrl: string | null;
}

export async function fetchSettings(): Promise<Settings> {
  const { data } = await apiClient.get<Settings>('/settings');
  return data;
}

export async function updateSettings(input: { mapaFondoUrl: string | null }): Promise<Settings> {
  const { data } = await apiClient.patch<Settings>('/settings', input);
  return data;
}
