import { Wheat, Clock, ListChecks } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { resolveAssetUrl } from '../../api/client';
import type { Formula } from '../../api/types';

export function FormulaCard({ formula }: { formula: Formula }) {
  const foto = resolveAssetUrl(formula.fotoUrl);

  return (
    <Card className="flex gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        {foto ? (
          <img src={foto} alt={formula.nombre} className="h-full w-full object-cover" />
        ) : (
          <Wheat size={26} strokeWidth={1.5} className="text-slate-300" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-slate-900">{formula.nombre}</h3>
          <span className="shrink-0 rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-600">
            ${formula.costoPorKilo}/kg
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">{formula.composicion}</p>

        {formula.proposito && <p className="mt-2 text-xs text-slate-600">{formula.proposito}</p>}

        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
          {formula.frecuencia && (
            <span className="flex items-center gap-1">
              <Clock size={12} strokeWidth={2.25} />
              {formula.frecuencia}
            </span>
          )}
          {formula.instrucciones && (
            <span className="flex items-center gap-1" title={formula.instrucciones}>
              <ListChecks size={12} strokeWidth={2.25} />
              {formula.instrucciones}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
