import { apiClient } from './client';
import type { Formula } from './types';

export interface CreateFormulaInput {
  nombre: string;
  composicion: string;
  costoPorKilo: number;
  fotoUrl?: string;
  proposito?: string;
  frecuencia?: string;
  instrucciones?: string;
}

export async function fetchFormulas(): Promise<Formula[]> {
  const { data } = await apiClient.get<Formula[]>('/formulas');
  return data;
}

export async function createFormula(input: CreateFormulaInput): Promise<Formula> {
  const { data } = await apiClient.post<Formula>('/formulas', input);
  return data;
}
