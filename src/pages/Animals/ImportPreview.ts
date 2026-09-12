import type { Corral } from '../../api/types';

export interface FieldMapping {
  arete: string;
  fechaIngreso: string;
  pesoIngreso: string;
  corral: string;
}

export type RowStatus = 'ok' | 'duplicado' | 'corral_no_encontrado' | 'arete_existente' | 'incompleto';

export interface PreviewRow {
  index: number;
  arete: string;
  fechaIngreso: string;
  pesoIngreso: string;
  corralNombre: string;
  corralId?: string;
  status: RowStatus;
}

export const STATUS_LABEL: Record<RowStatus, { label: string; tone: 'green' | 'amber' | 'red' }> = {
  ok: { label: 'Lista para importar', tone: 'green' },
  duplicado: { label: 'Fila duplicada (se omite)', tone: 'amber' },
  arete_existente: { label: 'El arete ya existe', tone: 'amber' },
  corral_no_encontrado: { label: 'Corral no encontrado', tone: 'red' },
  incompleto: { label: 'Faltan datos requeridos', tone: 'red' },
};

/** Adivina que columna del Excel corresponde a cada campo, por nombre de encabezado. */
export function guessMapping(headers: string[]): Partial<FieldMapping> {
  const find = (keywords: string[]) =>
    headers.find((header) => keywords.some((keyword) => header.toLowerCase().includes(keyword)));

  return {
    arete: find(['arete', 'tag', 'etiqueta']),
    fechaIngreso: find(['fecha ingreso', 'fecha de ingreso', 'ingreso']),
    pesoIngreso: find(['peso ingreso', 'peso de ingreso', 'peso']),
    corral: find(['corral']),
  };
}

function buildRowSignature(arete: string, fecha: string, peso: string, corral: string): string {
  return `${arete.toLowerCase()}|${fecha}|${peso}|${corral.toLowerCase()}`;
}

/**
 * Evalua cada fila del Excel: si falta algo requerido, si el corral no existe,
 * si el arete ya esta en el sistema, o si es una fila EXACTAMENTE igual a otra
 * ya vista en este mismo archivo (esa nunca se sube, sea la que sea).
 */
export function buildPreviewRows(
  rows: Record<string, string>[],
  mapping: FieldMapping,
  corrales: Corral[],
  existingAretes: Set<string>,
): PreviewRow[] {
  const seenSignatures = new Set<string>();

  return rows.map((row, index) => {
    const arete = (row[mapping.arete] ?? '').trim();
    const fechaIngreso = (row[mapping.fechaIngreso] ?? '').trim();
    const pesoIngreso = (row[mapping.pesoIngreso] ?? '').trim();
    const corralNombre = (row[mapping.corral] ?? '').trim();
    const base = { index, arete, fechaIngreso, pesoIngreso, corralNombre };

    if (!arete || !fechaIngreso || !pesoIngreso || !corralNombre || Number.isNaN(Number(pesoIngreso))) {
      return { ...base, status: 'incompleto' as const };
    }

    const signature = buildRowSignature(arete, fechaIngreso, pesoIngreso, corralNombre);
    if (seenSignatures.has(signature)) {
      return { ...base, status: 'duplicado' as const };
    }
    seenSignatures.add(signature);

    if (existingAretes.has(arete.toLowerCase())) {
      return { ...base, status: 'arete_existente' as const };
    }

    const corral = corrales.find((c) => c.nombre.toLowerCase() === corralNombre.toLowerCase());
    if (!corral) {
      return { ...base, status: 'corral_no_encontrado' as const };
    }

    return { ...base, corralId: corral.id, status: 'ok' as const };
  });
}
