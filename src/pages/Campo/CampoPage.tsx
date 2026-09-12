import { Tractor, Fence } from 'lucide-react';
import { useCorrales } from '../../hooks/useCorrales';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { RacionForm } from '../../components/RacionForm';
import { resolveAssetUrl } from '../../api/client';

export function CampoPage() {
  const { corrales, loading, error } = useCorrales();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        icon={Tractor}
        title="Ración del día"
        description="Selecciona el corral y registra cuánta fórmula echaste"
      />

      {loading && <LoadingSkeleton rows={2} />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && corrales.length === 0 && (
        <EmptyState title="Todavía no hay corrales configurados" />
      )}

      {!loading && !error && corrales.length > 0 && (
        <>
          <Card>
            <h2 className="mb-3 text-base font-medium text-slate-700">Corrales</h2>
            <ul className="grid grid-cols-2 gap-3">
              {corrales.map((c) => {
                const foto = resolveAssetUrl(c.fotoUrl);
                return (
                  <li
                    key={c.id}
                    className="tap-target flex flex-col items-center justify-center rounded-lg bg-brand-50 p-4 text-center"
                  >
                    <div className="mb-2 flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-brand-200 bg-white">
                      {foto ? (
                        <img src={foto} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Fence size={22} strokeWidth={1.75} className="text-brand-300" />
                      )}
                    </div>
                    <span className="text-base font-semibold text-brand-800">{c.nombre}</span>
                    {c.proposito && <span className="text-xs text-brand-500">{c.proposito}</span>}
                    <span className="text-xs text-brand-600">
                      {c.animalesActivos ?? 0} / {c.capacidad} cabezas
                    </span>
                    {c.formulaAsignada && (
                      <span className="mt-1 rounded-full bg-accent-50 px-2 py-0.5 text-[11px] font-medium text-accent-600">
                        {c.formulaAsignada.nombre}
                        {c.formulaAsignada.frecuencia && ` · ${c.formulaAsignada.frecuencia}`}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>

          <RacionForm corrales={corrales} large />
        </>
      )}
    </div>
  );
}
