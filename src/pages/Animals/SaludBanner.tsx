import { AlertTriangle, Stethoscope } from 'lucide-react';
import type { SaludInfo } from '../../api/types';

/**
 * Dias reales en tratamiento vs. el promedio de curacion calculado de
 * episodios pasados (nunca un numero inventado). Si no hay historial
 * todavia, solo se muestran los dias — no se compara contra nada.
 */
export function SaludBanner({ salud }: { salud: SaludInfo | null }) {
  if (!salud) return null;

  const dias = `${salud.diasTranscurridos} día${salud.diasTranscurridos === 1 ? '' : 's'}`;
  const motivo = salud.enfermedad ? `con ${salud.enfermedad}` : 'enfermo';
  const promedioTexto =
    salud.promedioDiasCuracion != null ? `${salud.promedioDiasCuracion.toFixed(1)} días` : null;

  if (salud.excedePromedio) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
        <AlertTriangle size={16} strokeWidth={2.25} className="mt-0.5 shrink-0" />
        <p>
          Lleva <strong>{dias}</strong> {motivo} — más que el promedio de curación ({promedioTexto}).{' '}
          <strong>Favor de revisar con el veterinario.</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
      <Stethoscope size={14} strokeWidth={2.25} />
      {dias} {motivo}
      {promedioTexto && ` — promedio de curación: ${promedioTexto}`}
    </div>
  );
}
