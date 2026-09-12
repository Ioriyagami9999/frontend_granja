import { apiClient } from './client';
import type { AnimalEnCorral, Corral, RacionCorral } from './types';

export interface CreateCorralInput {
  nombre: string;
  capacidad: number;
  proposito?: string;
  formulaAsignadaId?: string;
  fotoUrl?: string;
}

export interface UpdateCorralInput {
  proposito?: string;
  formulaAsignadaId?: string;
  /** string para setear, null para quitar la foto, undefined para no tocarla. */
  fotoUrl?: string | null;
  posX?: number;
  posY?: number;
}

export interface CreateRacionInput {
  formulaId: string;
  kilosAplicados: number;
  fecha: string;
}

export async function fetchCorrales(): Promise<Corral[]> {
  const { data } = await apiClient.get<Corral[]>('/corrales');
  return data;
}

export async function fetchCorral(id: string): Promise<Corral> {
  const { data } = await apiClient.get<Corral>(`/corrales/${id}`);
  return data;
}

export async function createCorral(input: CreateCorralInput): Promise<Corral> {
  const { data } = await apiClient.post<Corral>('/corrales', input);
  return data;
}

export async function updateCorral(id: string, input: UpdateCorralInput): Promise<Corral> {
  const { data } = await apiClient.patch<Corral>(`/corrales/${id}`, input);
  return data;
}

export async function fetchAnimalesEnCorral(id: string): Promise<AnimalEnCorral[]> {
  const { data } = await apiClient.get<AnimalEnCorral[]>(`/corrales/${id}/animales`);
  return data;
}

export async function createRacion(corralId: string, input: CreateRacionInput): Promise<RacionCorral> {
  const { data } = await apiClient.post<RacionCorral>(`/corrales/${corralId}/raciones`, input);
  return data;
}

export async function fetchRaciones(corralId: string): Promise<RacionCorral[]> {
  const { data } = await apiClient.get<RacionCorral[]>(`/corrales/${corralId}/raciones`);
  return data;
}
