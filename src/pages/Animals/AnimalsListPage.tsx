import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ScanLine, Search, Beef, Download, Upload } from 'lucide-react';
import { useAnimals } from '../../hooks/useAnimals';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { resolveAssetUrl } from '../../api/client';
import { exportToExcel } from '../../utils/excel';
import type { Animal } from '../../api/types';

function exportAnimals(animals: Animal[]) {
  const rows = animals.map((a) => ({
    Arete: a.arete,
    'Fecha ingreso': new Date(a.fechaIngreso).toLocaleDateString('es-MX'),
    'Peso ingreso (kg)': a.pesoIngreso,
    Corral: a.corralActual?.nombre ?? '',
    Estado: a.estado,
    Enfermo: a.enfermo ? 'Sí' : 'No',
    'Fecha salida': a.fechaSalida ? new Date(a.fechaSalida).toLocaleDateString('es-MX') : '',
    'Peso salida (kg)': a.pesoSalida ?? '',
    'Fecha muerte': a.fechaMuerte ? new Date(a.fechaMuerte).toLocaleDateString('es-MX') : '',
    'Causa muerte': a.causaMuerte ?? '',
  }));
  exportToExcel(`animales-${new Date().toISOString().slice(0, 10)}.xlsx`, 'Animales', rows);
}

function AnimalThumb({ animal }: { animal: Animal }) {
  const foto = resolveAssetUrl(animal.fotoUrl);
  return (
    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      {foto ? (
        <img src={foto} alt="" className="h-full w-full object-cover" />
      ) : (
        <Beef size={15} strokeWidth={1.75} className="text-slate-300" />
      )}
    </div>
  );
}

const ESTADO_TONE = { activo: 'green', vendido: 'slate', muerto: 'red' } as const;

const COLUMNS: Column<Animal>[] = [
  {
    header: '',
    render: (a) => <AnimalThumb animal={a} />,
  },
  { header: 'Arete', render: (a) => <span className="font-medium text-slate-900">{a.arete}</span> },
  { header: 'Corral', render: (a) => a.corralActual?.nombre ?? '—' },
  { header: 'Peso ingreso', render: (a) => `${a.pesoIngreso} kg` },
  { header: 'Ingreso', render: (a) => new Date(a.fechaIngreso).toLocaleDateString() },
  {
    header: 'Estado',
    render: (a) => (
      <div className="flex gap-1.5">
        <Badge tone={ESTADO_TONE[a.estado]}>{a.estado}</Badge>
        {a.enfermo && <Badge tone="amber">enfermo</Badge>}
      </div>
    ),
  },
];

export function AnimalsListPage() {
  const { animals, loading, error } = useAnimals();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = animals.filter((a) => a.arete.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <PageHeader
        icon={Beef}
        title="Animales"
        description="Inventario y expediente de cada animal"
        actions={
          <>
            <Button variant="secondary" onClick={() => exportAnimals(animals)} className="flex items-center gap-1.5">
              <Download size={15} strokeWidth={2.25} />
              Exportar
            </Button>
            <Button variant="secondary" onClick={() => navigate('/animales/importar')} className="flex items-center gap-1.5">
              <Upload size={15} strokeWidth={2.25} />
              Importar Excel
            </Button>
            <Button variant="secondary" onClick={() => navigate('/animales/escanear')} className="flex items-center gap-1.5">
              <ScanLine size={15} strokeWidth={2.25} />
              Escanear
            </Button>
            <Button onClick={() => navigate('/animales/nuevo')} className="flex items-center gap-1.5">
              <Plus size={15} strokeWidth={2.5} />
              Registrar animal
            </Button>
          </>
        }
      />

      <div className="relative max-w-xs">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por arete…"
          className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {loading && <LoadingSkeleton rows={4} />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          title="Sin animales registrados"
          description="Registra el primer animal escaneando o capturando su arete."
        />
      )}
      {!loading && !error && filtered.length > 0 && (
        <DataTable
          columns={COLUMNS}
          rows={filtered}
          rowKey={(a) => a.id}
          onRowClick={(a) => navigate(`/animales/${a.arete}`)}
        />
      )}
    </div>
  );
}
