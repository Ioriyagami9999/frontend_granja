import { apiClient } from './client';
import type { Animal, Expediente } from './types';

export interface CreateAnimalInput {
  arete: string;
  fechaIngreso: string;
  pesoIngreso: number;
  corralId: string;
  fotoUrl?: string;
}

export interface AddPesajeInput {
  peso: number;
  fecha: string;
}

export interface AddMedicamentoInput {
  enfermedad?: string;
  medicamento: string;
  dosis: string;
  costo?: number;
  fecha: string;
}

export interface AddMovimientoInput {
  corralDestinoId: string;
  fecha: string;
}

export interface ExportAnimalInput {
  fechaSalida: string;
  pesoSalida: number;
}

export interface MarkDeadInput {
  fecha: string;
  causa?: string;
  lugar?: string;
  fotoUrl?: string;
  reporte?: string;
  fechaLevantamiento?: string;
}

export async function fetchAnimals(): Promise<Animal[]> {
  const { data } = await apiClient.get<Animal[]>('/animals');
  return data;
}

export async function createAnimal(input: CreateAnimalInput): Promise<Animal> {
  const { data } = await apiClient.post<Animal>('/animals', input);
  return data;
}

export async function fetchExpediente(arete: string): Promise<Expediente> {
  const { data } = await apiClient.get<Expediente>(`/animals/${arete}/expediente`);
  return data;
}

export async function addPesaje(animalId: string, input: AddPesajeInput) {
  const { data } = await apiClient.post(`/animals/${animalId}/pesajes`, input);
  return data;
}

export async function addMedicamento(animalId: string, input: AddMedicamentoInput) {
  const { data } = await apiClient.post(`/animals/${animalId}/medicamentos`, input);
  return data;
}

export async function addMovimiento(animalId: string, input: AddMovimientoInput) {
  const { data } = await apiClient.post(`/animals/${animalId}/movimientos`, input);
  return data;
}

export async function exportAnimal(animalId: string, input: ExportAnimalInput): Promise<Animal> {
  const { data } = await apiClient.post<Animal>(`/animals/${animalId}/exportar`, input);
  return data;
}

export async function markDead(animalId: string, input: MarkDeadInput): Promise<Animal> {
  const { data } = await apiClient.post<Animal>(`/animals/${animalId}/muerte`, input);
  return data;
}

export async function setEnfermo(animalId: string, enfermo: boolean): Promise<Animal> {
  const { data } = await apiClient.patch<Animal>(`/animals/${animalId}/salud`, { enfermo });
  return data;
}
