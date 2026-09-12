import { Link, useParams } from 'react-router-dom';
import { Fence, Clock, Beef } from 'lucide-react';
import { useCorral } from '../../hooks/useCorral';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { BackLink } from '../../components/ui/BackLink';
import { RacionForm } from '../../components/RacionForm';
import { EditCorralForm } from './EditCorralForm';
import { resolveAssetUrl } from '../../api/client';

export function CorralDetailPage() {
  const { id = '' } = useParams();
  const { corral, raciones, animales, loading, error, reload } = useCorral(id);

  if (loading) return <LoadingSkeleton rows={5} />;
  if (error || !corral) {
    return <EmptyState title="No se encontró el corral" description={error ?? undefined} />;
  }

  const foto = resolveAssetUrl(corral.fotoUrl);

  return (
    <div className="max-w-2xl space-y-6">
      <BackLink to="/corrales" label="Volver a Corrales" />

      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-brand-100 text-brand-700">
          {foto ? (
            <img src={foto} alt={corral.nombre} className="h-full w-full object-cover" />
          ) : (
            <Fence size={24} strokeWidth={1.75} />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{corral.nombre}</h1>
          <p className="text-sm text-slate-500">{corral.proposito ?? 'Sin propósito definido'}</p>
          {corral.formulaAsignada && (
            <p className="text-xs text-slate-400">
              Come: {corral.formulaAsignada.nombre}
              {corral.formulaAsignada.frecuencia && ` · ${corral.formulaAsignada.frecuencia}`}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Animales activos"
          value={String(corral.animalesActivos ?? 0)}
          hint={`Capacidad: ${corral.capacidad} cabezas`}
        />
        <StatCard label="Raciones registradas" value={String(raciones.length)} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <EditCorralForm corral={corral} onSaved={reload} />
        <RacionForm corrales={[corral]} fixedCorral={corral} onRegistered={reload} />
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-medium text-slate-700">Animales en este corral</h2>
        {animales.length === 0 ? (
          <EmptyState title="Sin animales en este corral por ahora" />
        ) : (
          <ul className="space-y-2">
            {animales.map((animal) => {
              const foto = resolveAssetUrl(animal.fotoUrl);
              return (
                <li key={animal.id}>
                  <Link
                    to={`/animales/${animal.arete}`}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                      {foto ? (
                        <img src={foto} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Beef size={15} strokeWidth={1.75} className="text-slate-300" />
                      )}
                    </div>
                    <span className="flex-1 text-sm font-medium text-slate-800">{animal.arete}</span>
                    <span className="text-sm text-slate-500">{animal.pesoActual} kg</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-medium text-slate-700">Historial de raciones (seguimiento del corral)</h2>
        {raciones.length === 0 ? (
          <EmptyState title="Sin raciones registradas todavía" />
        ) : (
          <ul className="space-y-3">
            {raciones.map((racion) => (
              <li
                key={racion.id}
                className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
              >
                <p className="text-sm font-medium text-slate-800">
                  {racion.formula.nombre} — {racion.kilosAplicados} kg
                </p>
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={11} strokeWidth={2.25} />
                  {new Date(racion.fecha).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
