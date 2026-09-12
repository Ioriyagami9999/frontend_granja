import { Beef, Fence, LayoutDashboard, Wallet } from 'lucide-react';
import { useAnimals } from '../../hooks/useAnimals';
import { useCorrales } from '../../hooks/useCorrales';
import { StatCard } from '../../components/ui/StatCard';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { BarList } from '../../components/charts/BarList';

export function DashboardPage() {
  const { animals, loading: loadingAnimals } = useAnimals();
  const { corrales, loading: loadingCorrales } = useCorrales();
  const loading = loadingAnimals || loadingCorrales;

  const activos = animals.filter((a) => a.estado === 'activo');
  const porCorral = corrales
    .map((corral) => ({
      label: corral.nombre,
      value: activos.filter((a) => a.corralActual?.id === corral.id).length,
    }))
    .sort((a, b) => b.value - a.value);

  const pesoTotal = activos.reduce((sum, a) => sum + Number(a.pesoIngreso), 0);
  const recientes = [...animals]
    .sort((a, b) => new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader icon={LayoutDashboard} title="Dashboard" description="Resumen general de la engorda" />

      {loading ? (
        <LoadingSkeleton rows={2} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Animales activos" value={String(activos.length)} icon={Beef} />
          <StatCard label="Corrales en uso" value={String(corrales.length)} icon={Fence} />
          <StatCard
            label="Peso vivo estimado"
            value={`${pesoTotal.toLocaleString('es-MX')} kg`}
            hint="Suma del peso de ingreso de animales activos"
            icon={Wallet}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-medium text-slate-700">Animales activos por corral</h2>
          {loading ? (
            <LoadingSkeleton rows={3} />
          ) : porCorral.length === 0 ? (
            <EmptyState title="Todavía no hay animales activos" />
          ) : (
            <BarList items={porCorral} />
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-medium text-slate-700">Altas recientes</h2>
          {loading ? (
            <LoadingSkeleton rows={3} />
          ) : recientes.length === 0 ? (
            <EmptyState title="Todavía no hay animales registrados" />
          ) : (
            <ul className="space-y-3">
              {recientes.map((animal) => (
                <li key={animal.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{animal.arete}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(animal.fechaIngreso).toLocaleDateString('es-MX')} · {animal.corralActual?.nombre}
                    </p>
                  </div>
                  <Badge tone={animal.estado === 'activo' ? 'green' : 'slate'}>{animal.estado}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
