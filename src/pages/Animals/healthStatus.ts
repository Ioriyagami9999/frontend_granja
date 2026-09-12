import type { MedicamentoAplicado } from '../../api/types';

const DIAS_EN_TRATAMIENTO = 3;

export interface EstadoSalud {
  enTratamiento: boolean;
  registradoHoy: boolean;
  ultimo: MedicamentoAplicado | null;
}

/** Deriva el estado de salud visible a partir del ultimo medicamento aplicado — no hay un flag "enfermo" separado, se infiere del historial real. */
export function calcularEstadoSalud(medicamentos: MedicamentoAplicado[]): EstadoSalud {
  if (medicamentos.length === 0) return { enTratamiento: false, registradoHoy: false, ultimo: null };

  const ultimo = [...medicamentos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  )[0];

  const horasDesde = (Date.now() - new Date(ultimo.fecha).getTime()) / (1000 * 60 * 60);
  const registradoHoy = new Date(ultimo.fecha).toDateString() === new Date().toDateString();

  return { enTratamiento: horasDesde <= DIAS_EN_TRATAMIENTO * 24, registradoHoy, ultimo };
}
