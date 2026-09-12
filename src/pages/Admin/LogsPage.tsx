import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, ScrollText } from 'lucide-react';
import { fetchLogs } from '../../api/logs';
import type { RequestLog } from '../../api/types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';

const PAGE_SIZE = 20;

const METHOD_TONE: Record<string, 'green' | 'amber' | 'slate' | 'red'> = {
  GET: 'slate',
  POST: 'green',
  PATCH: 'amber',
  PUT: 'amber',
  DELETE: 'red',
};

function statusTone(statusCode: number | null): 'green' | 'amber' | 'slate' | 'red' {
  if (statusCode === null) return 'slate';
  if (statusCode >= 500) return 'red';
  if (statusCode >= 400) return 'amber';
  return 'green';
}

function formatFechaHora(iso: string): string {
  return new Date(iso).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });
}

function LogBodyPreview({ label, body }: { label: string; body: Record<string, unknown> | null }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <pre className="max-h-64 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
        {body ? JSON.stringify(body, null, 2) : '(vacío)'}
      </pre>
    </div>
  );
}

function LogRow({ log }: { log: RequestLog }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
      >
        {expanded ? (
          <ChevronDown size={15} strokeWidth={2.25} className="shrink-0 text-slate-400" />
        ) : (
          <ChevronRight size={15} strokeWidth={2.25} className="shrink-0 text-slate-400" />
        )}
        <span className="w-44 shrink-0 text-xs text-slate-500">{formatFechaHora(log.createdAt)}</span>
        <Badge tone={METHOD_TONE[log.method] ?? 'slate'}>{log.method}</Badge>
        <span className="flex-1 truncate font-mono text-xs text-slate-700">{log.path}</span>
        <Badge tone={statusTone(log.statusCode)}>{log.statusCode ?? '—'}</Badge>
        <span className="w-40 shrink-0 truncate text-xs text-slate-500">{log.userEmail ?? 'anónimo'}</span>
        <span className="w-16 shrink-0 text-right text-xs text-slate-400">
          {log.durationMs !== null ? `${log.durationMs} ms` : '—'}
        </span>
      </button>
      {expanded && (
        <div className="grid grid-cols-1 gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:grid-cols-2">
          <LogBodyPreview label="Cuerpo de la petición" body={log.requestBody} />
          <LogBodyPreview label="Cuerpo de la respuesta" body={log.responseBody} />
        </div>
      )}
    </div>
  );
}

export function LogsPage() {
  const [data, setData] = useState<{ items: RequestLog[]; total: number } | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchLogs(page, PAGE_SIZE)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo cargar la bitácora de peticiones.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="space-y-4">
      <PageHeader
        icon={ScrollText}
        title="Bitácora de peticiones"
        description="Ruta, método, usuario, cuerpo enviado y respondido por el backend, con fecha y hora exactas."
      />

      {loading && <LoadingSkeleton rows={6} />}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && data && data.items.length === 0 && (
        <EmptyState title="Sin peticiones registradas" description="Todavía no hay actividad en la bitácora." />
      )}

      {!loading && !error && data && data.items.length > 0 && (
        <Card className="!p-0">
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            <span className="w-3.5" />
            <span className="w-44 shrink-0">Fecha y hora</span>
            <span className="w-[52px] shrink-0">Método</span>
            <span className="flex-1">Ruta</span>
            <span className="w-10 shrink-0">Estado</span>
            <span className="w-40 shrink-0">Usuario</span>
            <span className="w-16 shrink-0 text-right">Duración</span>
          </div>
          {data.items.map((log) => (
            <LogRow key={log.id} log={log} />
          ))}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={data.total} pageSize={PAGE_SIZE} />
        </Card>
      )}
    </div>
  );
}
