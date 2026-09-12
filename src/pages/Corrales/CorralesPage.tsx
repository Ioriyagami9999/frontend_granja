import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Fence } from 'lucide-react';
import { useCorrales } from '../../hooks/useCorrales';
import { createCorral } from '../../api/corrales';
import { extractErrorMessage } from '../../api/errors';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { TextField } from '../../components/form/TextField';
import { SelectField } from '../../components/form/SelectField';
import { ImageUpload } from '../../components/form/ImageUpload';
import { RacionForm } from '../../components/RacionForm';
import { useFormulas } from '../../hooks/useFormulas';
import { resolveAssetUrl } from '../../api/client';
import type { Corral } from '../../api/types';

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  capacidad: z.number({ message: 'Ingresa un número' }).int('Debe ser un entero').positive('Debe ser mayor a 0'),
  proposito: z.string().optional(),
  formulaAsignadaId: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

function CorralThumb({ corral }: { corral: Corral }) {
  const foto = resolveAssetUrl(corral.fotoUrl);
  return (
    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      {foto ? (
        <img src={foto} alt="" className="h-full w-full object-cover" />
      ) : (
        <Fence size={15} strokeWidth={1.75} className="text-slate-300" />
      )}
    </div>
  );
}

const COLUMNS: Column<Corral>[] = [
  { header: '', render: (c) => <CorralThumb corral={c} /> },
  { header: 'Nombre', render: (c) => <span className="font-medium text-slate-900">{c.nombre}</span> },
  { header: 'Propósito', render: (c) => c.proposito ?? <span className="text-slate-400">—</span> },
  {
    header: 'Come',
    render: (c) =>
      c.formulaAsignada ? (
        <span>
          {c.formulaAsignada.nombre}
          {c.formulaAsignada.frecuencia && <span className="text-slate-400"> · {c.formulaAsignada.frecuencia}</span>}
        </span>
      ) : (
        <span className="text-slate-400">—</span>
      ),
  },
  {
    header: 'Animales',
    render: (c) => (
      <Badge tone={(c.animalesActivos ?? 0) > 0 ? 'green' : 'slate'}>
        {c.animalesActivos ?? 0} / {c.capacidad}
      </Badge>
    ),
  },
];

export function CorralesPage() {
  const { corrales, loading, error, reload } = useCorrales();
  const { formulas, loading: loadingFormulas } = useFormulas();
  const [serverError, setServerError] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { nombre: '', capacidad: undefined, proposito: '', formulaAsignadaId: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await createCorral({
        ...values,
        formulaAsignadaId: values.formulaAsignadaId || undefined,
        fotoUrl: fotoUrl ?? undefined,
      });
      reset({ nombre: '', capacidad: undefined, proposito: '', formulaAsignadaId: '' });
      setFotoUrl(null);
      await reload();
    } catch (err) {
      setServerError(extractErrorMessage(err, 'No se pudo crear el corral.'));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Fence}
        title="Corrales"
        description="Cada corral, para qué se usa, y cuántos animales tiene ahora"
      />

      {loading && <LoadingSkeleton rows={3} />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && corrales.length === 0 && <EmptyState title="Sin corrales registrados" />}
      {!loading && !error && corrales.length > 0 && (
        <DataTable
          columns={COLUMNS}
          rows={corrales}
          rowKey={(c) => c.id}
          onRowClick={(c) => navigate(`/corrales/${c.id}`)}
        />
      )}

      <Card className="max-w-md">
        <h2 className="mb-3 text-sm font-medium text-slate-700">Nuevo corral</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
          <ImageUpload label="Foto del corral (opcional)" value={fotoUrl} onChange={setFotoUrl} />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <TextField label="Nombre" registration={register('nombre')} error={errors.nombre?.message} />
            </div>
            <div className="w-28">
              <TextField
                label="Capacidad"
                type="number"
                registration={register('capacidad', { valueAsNumber: true })}
                error={errors.capacidad?.message}
              />
            </div>
          </div>
          <TextField
            label="Propósito (opcional)"
            placeholder="Ej. Becerros, Terminación, Cuarentena"
            registration={register('proposito')}
            error={errors.proposito?.message}
          />
          <SelectField
            label="Fórmula que normalmente come (opcional)"
            registration={register('formulaAsignadaId')}
            disabled={loadingFormulas}
          >
            <option value="">Sin fórmula asignada</option>
            {formulas.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre} {f.frecuencia ? `(${f.frecuencia})` : ''}
              </option>
            ))}
          </SelectField>
          <Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
            {isSubmitting ? 'Creando…' : 'Crear corral'}
          </Button>
        </form>
        {serverError && <p className="mt-2 text-sm text-red-600">{serverError}</p>}
      </Card>

      <RacionForm corrales={corrales} />
    </div>
  );
}
