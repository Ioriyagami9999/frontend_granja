export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  role: string;
  permissions: string[];
}

export interface Permission {
  id: string;
  code: string;
  description: string;
}

export interface Role {
  id: string;
  nombre: string;
  descripcion: string | null;
  permissions: Permission[];
}

export interface AppUser {
  id: string;
  email: string;
  nombre: string;
  role: Role;
  createdAt: string;
}

export interface Corral {
  id: string;
  nombre: string;
  capacidad: number;
  proposito: string | null;
  formulaAsignada: Formula | null;
  fotoUrl: string | null;
  animalesActivos?: number;
  posX: number | null;
  posY: number | null;
}

export interface AnimalEnCorral {
  id: string;
  arete: string;
  fotoUrl: string | null;
  pesoActual: string;
}

export interface Formula {
  id: string;
  nombre: string;
  composicion: string;
  costoPorKilo: string;
  fotoUrl: string | null;
  proposito: string | null;
  frecuencia: string | null;
  instrucciones: string | null;
}

export type AnimalEstado = 'activo' | 'vendido' | 'muerto';

export interface Animal {
  id: string;
  arete: string;
  fechaIngreso: string;
  fechaSalida: string | null;
  pesoIngreso: string;
  pesoSalida: string | null;
  estado: AnimalEstado;
  corralActual: Corral;
  fotoUrl: string | null;
  enfermo: boolean;
  fechaMuerte: string | null;
  causaMuerte: string | null;
  lugarMuerte: string | null;
  fotoMuerte: string | null;
  reporteMuerte: string | null;
  fechaLevantamiento: string | null;
}

export interface Pesaje {
  id: string;
  peso: string;
  origen: 'manual' | 'bascula';
  fecha: string;
}

export interface MedicamentoAplicado {
  id: string;
  enfermedad: string | null;
  medicamento: string;
  dosis: string;
  costo: string;
  fecha: string;
}

export interface MovimientoCorral {
  id: string;
  corralOrigen: Corral | null;
  corralDestino: Corral;
  fecha: string;
}

export interface SaludInfo {
  enfermedad: string | null;
  fechaInicio: string;
  diasTranscurridos: number;
  promedioDiasCuracion: number | null;
  excedePromedio: boolean;
}

export interface Expediente {
  animal: Animal;
  pesajes: Pesaje[];
  medicamentos: MedicamentoAplicado[];
  movimientos: MovimientoCorral[];
  diasEnEngorda: number;
  costoAcumulado: number;
  salud: SaludInfo | null;
}

export interface RacionCorral {
  id: string;
  corral: Corral;
  formula: Formula;
  kilosAplicados: string;
  fecha: string;
}

export interface RequestLog {
  id: string;
  method: string;
  path: string;
  statusCode: number | null;
  userId: string | null;
  userEmail: string | null;
  requestBody: Record<string, unknown> | null;
  responseBody: Record<string, unknown> | null;
  durationMs: number | null;
  createdAt: string;
}

export interface PaginatedLogs {
  items: RequestLog[];
  total: number;
  page: number;
  pageSize: number;
}
