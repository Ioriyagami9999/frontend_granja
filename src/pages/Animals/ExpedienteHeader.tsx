import { Beef } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { resolveAssetUrl } from '../../api/client';
import { SaludBanner } from './SaludBanner';
import type { Expediente } from '../../api/types';

function latestPeso(expediente: Expediente): string {
  if (expediente.pesajes.length === 0) return expediente.animal.pesoIngreso;
  return [...expediente.pesajes].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0].peso;
}

const ESTADO_TONE = { activo: 'green', vendido: 'slate', muerto: 'red' } as const;

export function ExpedienteHeader({ expediente }: { expediente: Expediente }) {
  const { animal, diasEnEngorda, costoAcumulado, gananciaDiariaPeso, conversionAlimenticia, salud } = expediente;
  const foto = resolveAssetUrl(animal.fotoUrl);
  const corral = animal.corralActual;
  const formula = corral?.formulaAsignada;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            {foto ? (
              <img src={foto} alt={`Foto del animal ${animal.arete}`} className="h-full w-full object-cover" />
            ) : (
              <Beef size={22} strokeWidth={1.75} className="text-slate-300" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Arete {animal.arete}</h1>
            <p className="text-sm text-slate-500">
              Corral actual: {corral?.nombre ?? '—'}
              {corral?.proposito && <span className="text-slate-400"> · {corral.proposito}</span>}
            </p>
            {formula && (
              <p className="text-xs text-slate-400">
                Come: {formula.nombre}
                {formula.frecuencia && ` · ${formula.frecuencia}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge tone={ESTADO_TONE[animal.estado]}>{animal.estado}</Badge>
          {animal.enfermo && !salud?.excedePromedio && <Badge tone="amber">enfermo</Badge>}
        </div>
      </div>

      <SaludBanner salud={salud} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Días en engorda" value={String(diasEnEngorda)} />
        <StatCard label="Peso de ingreso" value={`${animal.pesoIngreso} kg`} />
        <StatCard label="Peso actual" value={`${latestPeso(expediente)} kg`} />
        <StatCard
          label="Costo acumulado"
          value={`$${costoAcumulado.toFixed(2)}`}
          hint="Alimento prorrateado + medicamentos"
        />
        <StatCard
          label="Ganancia diaria de peso"
          value={gananciaDiariaPeso !== null ? `${gananciaDiariaPeso.toFixed(2)} kg/día` : '—'}
          hint="(peso actual − peso de ingreso) / días en engorda"
        />
        <StatCard
          label="Conversión alimenticia"
          value={conversionAlimenticia !== null ? `${conversionAlimenticia.toFixed(2)} kg alim./kg carne` : '—'}
          hint={conversionAlimenticia === null ? 'Aún sin ganancia de peso registrada' : 'Alimento consumido / kg de peso ganado'}
        />
      </div>
    </div>
  );
}
