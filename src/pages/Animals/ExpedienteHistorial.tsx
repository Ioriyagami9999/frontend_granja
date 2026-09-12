import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { usePagination } from '../../hooks/usePagination';
import type { Expediente } from '../../api/types';

type Evento = { fecha: string; tipo: 'Pesaje' | 'Medicamento' | 'Movimiento'; detalle: string };

function buildEventos(expediente: Expediente): Evento[] {
  const pesajes: Evento[] = expediente.pesajes.map((p) => ({
    fecha: p.fecha,
    tipo: 'Pesaje',
    detalle: `${p.peso} kg (${p.origen})`,
  }));
  const medicamentos: Evento[] = expediente.medicamentos.map((m) => ({
    fecha: m.fecha,
    tipo: 'Medicamento',
    detalle: `${m.enfermedad ? `${m.enfermedad}: ` : ''}${m.medicamento} — ${m.dosis} ($${m.costo})`,
  }));
  const movimientos: Evento[] = expediente.movimientos.map((m) => ({
    fecha: m.fecha,
    tipo: 'Movimiento',
    detalle: `${m.corralOrigen?.nombre ?? 'Ingreso'} → ${m.corralDestino.nombre}`,
  }));
  return [...pesajes, ...medicamentos, ...movimientos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  );
}

const TONE_BY_TIPO = { Pesaje: 'green', Medicamento: 'amber', Movimiento: 'slate' } as const;

export function ExpedienteHistorial({ expediente }: { expediente: Expediente }) {
  const eventos = buildEventos(expediente);
  const { page, setPage, totalPages, pageItems, totalItems, pageSize } = usePagination(eventos, 8);

  if (eventos.length === 0) {
    return <EmptyState title="Sin eventos registrados todavía" />;
  }

  return (
    <Card className="!p-0">
      <h2 className="px-5 pt-5 text-sm font-medium text-slate-700">Historial completo</h2>
      <ul className="space-y-3 px-5 py-3">
        {pageItems.map((evento, index) => (
          <li key={index} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0">
            <Badge tone={TONE_BY_TIPO[evento.tipo]}>{evento.tipo}</Badge>
            <div>
              <p className="text-sm text-slate-800">{evento.detalle}</p>
              <p className="text-xs text-slate-400">{new Date(evento.fecha).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} pageSize={pageSize} />
    </Card>
  );
}
