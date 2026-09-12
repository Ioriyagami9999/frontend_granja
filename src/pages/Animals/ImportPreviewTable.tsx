import { Badge } from '../../components/ui/Badge';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { STATUS_LABEL, type PreviewRow } from './ImportPreview';

const COLUMNS: Column<PreviewRow>[] = [
  { header: 'Fila', render: (r) => r.index + 1 },
  { header: 'Arete', render: (r) => r.arete || '—' },
  { header: 'Fecha ingreso', render: (r) => r.fechaIngreso || '—' },
  { header: 'Peso', render: (r) => r.pesoIngreso || '—' },
  { header: 'Corral', render: (r) => r.corralNombre || '—' },
  {
    header: 'Estado',
    render: (r) => <Badge tone={STATUS_LABEL[r.status].tone}>{STATUS_LABEL[r.status].label}</Badge>,
  },
];

export function ImportPreviewTable({ rows }: { rows: PreviewRow[] }) {
  return <DataTable columns={COLUMNS} rows={rows} rowKey={(r) => String(r.index)} pageSize={10} />;
}
