import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Skull, Truck } from 'lucide-react';
import { exportAnimal, markDead } from '../../api/animals';
import { extractErrorMessage } from '../../api/errors';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/form/TextField';
import { ImageUpload } from '../../components/form/ImageUpload';
import type { Animal } from '../../api/types';

const exportSchema = z.object({
  fechaSalida: z.string().min(1, 'La fecha es requerida'),
  pesoSalida: z.number({ message: 'Ingresa un peso válido' }).positive('El peso debe ser mayor a 0'),
});
type ExportValues = z.infer<typeof exportSchema>;

const deathSchema = z.object({
  fecha: z.string().min(1, 'La fecha es requerida'),
  causa: z.string().optional(),
  lugar: z.string().optional(),
  reporte: z.string().optional(),
  fechaLevantamiento: z.string().optional(),
});
type DeathValues = z.infer<typeof deathSchema>;

export function BajaTab({ animal, onChanged }: { animal: Animal; onChanged: () => void }) {
  const [modo, setModo] = useState<'vendido' | 'muerto'>('vendido');

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={modo === 'vendido' ? 'primary' : 'secondary'}
          onClick={() => setModo('vendido')}
          className="flex flex-1 items-center justify-center gap-1.5"
        >
          <Truck size={15} strokeWidth={2.25} />
          Vender / Exportar
        </Button>
        <Button
          type="button"
          variant={modo === 'muerto' ? 'danger' : 'secondary'}
          onClick={() => setModo('muerto')}
          className="flex flex-1 items-center justify-center gap-1.5"
        >
          <Skull size={15} strokeWidth={2.25} />
          Marcar muerto
        </Button>
      </div>

      {modo === 'vendido' ? (
        <ExportForm animal={animal} onChanged={onChanged} />
      ) : (
        <DeathForm animal={animal} onChanged={onChanged} />
      )}
    </div>
  );
}

function ExportForm({ animal, onChanged }: { animal: Animal; onChanged: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ExportValues>({
    resolver: zodResolver(exportSchema),
    mode: 'onChange',
    defaultValues: { fechaSalida: new Date().toISOString().slice(0, 10), pesoSalida: undefined },
  });

  const onSubmit = async (values: ExportValues) => {
    setServerError(null);
    try {
      await exportAnimal(animal.id, {
        fechaSalida: new Date(values.fechaSalida).toISOString(),
        pesoSalida: values.pesoSalida,
      });
      onChanged();
    } catch (err) {
      setServerError(extractErrorMessage(err, 'No se pudo registrar la salida.'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
      <TextField label="Fecha de salida" type="date" registration={register('fechaSalida')} error={errors.fechaSalida?.message} />
      <TextField
        label="Peso de salida (kg)"
        type="number"
        step="0.1"
        registration={register('pesoSalida', { valueAsNumber: true })}
        error={errors.pesoSalida?.message}
      />
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
        {isSubmitting ? 'Guardando…' : 'Registrar venta/exportación'}
      </Button>
    </form>
  );
}

function DeathForm({ animal, onChanged }: { animal: Animal; onChanged: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<DeathValues>({
    resolver: zodResolver(deathSchema),
    mode: 'onChange',
    defaultValues: {
      fecha: new Date().toISOString().slice(0, 10),
      causa: '',
      lugar: '',
      reporte: '',
      fechaLevantamiento: '',
    },
  });

  const onSubmit = async (values: DeathValues) => {
    setServerError(null);
    try {
      await markDead(animal.id, {
        fecha: new Date(values.fecha).toISOString(),
        causa: values.causa,
        lugar: values.lugar,
        reporte: values.reporte,
        fotoUrl: fotoUrl ?? undefined,
        fechaLevantamiento: values.fechaLevantamiento ? new Date(values.fechaLevantamiento).toISOString() : undefined,
      });
      onChanged();
    } catch (err) {
      setServerError(extractErrorMessage(err, 'No se pudo registrar la muerte del animal.'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2 rounded-lg border border-red-100 bg-red-50/40 p-3">
      <ImageUpload label="Foto (evidencia)" value={fotoUrl} onChange={setFotoUrl} />
      <TextField label="Fecha de muerte" type="date" registration={register('fecha')} error={errors.fecha?.message} />
      <TextField label="Causa de muerte" placeholder="Ej. Complicaciones respiratorias" registration={register('causa')} />
      <TextField label="Lugar" placeholder="Ej. Corral 3" registration={register('lugar')} />
      <TextField
        label="Fecha en que se levantó el cuerpo"
        type="date"
        registration={register('fechaLevantamiento')}
      />
      <div>
        <label htmlFor="reporte" className="block text-sm font-medium text-slate-700">
          Reporte
        </label>
        <textarea
          id="reporte"
          rows={3}
          placeholder="Describe lo encontrado, hora, quien lo reporto, etc."
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          {...register('reporte')}
        />
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <Button type="submit" variant="danger" disabled={!isValid || isSubmitting} className="w-full">
        {isSubmitting ? 'Guardando…' : 'Confirmar muerte del animal'}
      </Button>
    </form>
  );
}
