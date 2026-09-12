import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Stethoscope, CheckCircle2, HeartPulse } from 'lucide-react';
import { addPesaje, addMedicamento, setEnfermo } from '../../api/animals';
import { extractErrorMessage } from '../../api/errors';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/form/TextField';
import { calcularEstadoSalud } from './healthStatus';
import type { MedicamentoAplicado } from '../../api/types';

const pesajeSchema = z.object({
  peso: z.number({ message: 'Ingresa un peso válido' }).positive('El peso debe ser mayor a 0'),
});
type PesajeValues = z.infer<typeof pesajeSchema>;

const medicamentoSchema = z.object({
  enfermedad: z.string().optional(),
  medicamento: z.string().min(1, 'El medicamento es requerido'),
  dosis: z.string().min(1, 'La dosis es requerida'),
  costo: z.number({ message: 'Ingresa un costo válido' }).min(0, 'El costo no puede ser negativo'),
});
type MedicamentoValues = z.infer<typeof medicamentoSchema>;

export function PesajeForm({ animalId, onSaved }: { animalId: string; onSaved: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PesajeValues>({
    resolver: zodResolver(pesajeSchema),
    mode: 'onChange',
    defaultValues: { peso: undefined },
  });

  const onSubmit = async (values: PesajeValues) => {
    setServerError(null);
    try {
      await addPesaje(animalId, { peso: values.peso, fecha: new Date().toISOString() });
      reset({ peso: undefined });
      onSaved();
    } catch (err) {
      setServerError(extractErrorMessage(err, 'No se pudo registrar el pesaje.'));
    }
  };

  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-slate-700">Registrar pesaje</h3>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex items-end gap-2">
        <div className="flex-1">
          <TextField
            label="Peso (kg)"
            type="number"
            step="0.1"
            autoFocus
            registration={register('peso', { valueAsNumber: true })}
            error={errors.peso?.message}
          />
        </div>
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar'}
        </Button>
      </form>
      {serverError && <p className="mt-2 text-sm text-red-600">{serverError}</p>}
    </div>
  );
}

interface MedicamentoFormProps {
  animalId: string;
  medicamentos: MedicamentoAplicado[];
  enfermo: boolean;
  onSaved: () => void;
}

export function MedicamentoForm({ animalId, medicamentos, enfermo, onSaved }: MedicamentoFormProps) {
  const { enTratamiento, registradoHoy, ultimo } = calcularEstadoSalud(medicamentos);
  const [requiere, setRequiere] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [recuperando, setRecuperando] = useState(false);

  const marcarRecuperado = async () => {
    setRecuperando(true);
    try {
      await setEnfermo(animalId, false);
      onSaved();
    } finally {
      setRecuperando(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<MedicamentoValues>({
    resolver: zodResolver(medicamentoSchema),
    mode: 'onChange',
    defaultValues: { enfermedad: '', medicamento: '', dosis: '', costo: 0 },
  });

  const onSubmit = async (values: MedicamentoValues) => {
    setServerError(null);
    try {
      await addMedicamento(animalId, { ...values, fecha: new Date().toISOString() });
      reset({ enfermedad: '', medicamento: '', dosis: '', costo: 0 });
      setRequiere(false);
      onSaved();
    } catch (err) {
      setServerError(extractErrorMessage(err, 'No se pudo registrar el medicamento.'));
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-700">Salud y medicamentos</h3>

      {enfermo && (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800">
          <span className="flex items-center gap-1.5">
            <HeartPulse size={14} strokeWidth={2.25} />
            Marcado como enfermo
          </span>
          <button
            type="button"
            onClick={marcarRecuperado}
            disabled={recuperando}
            className="rounded-md bg-white px-2 py-1 font-medium text-red-700 shadow-sm hover:bg-red-100 disabled:opacity-50"
          >
            {recuperando ? 'Guardando…' : 'Marcar como recuperado'}
          </button>
        </div>
      )}

      {enTratamiento && ultimo && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <Stethoscope size={14} strokeWidth={2.25} />
          En tratamiento{ultimo.enfermedad ? `: ${ultimo.enfermedad}` : ''} — última dosis el{' '}
          {new Date(ultimo.fecha).toLocaleDateString('es-MX')}
        </div>
      )}
      {registradoHoy && (
        <div className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
          <CheckCircle2 size={14} strokeWidth={2.25} />
          Ya se registró medicamento hoy
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={requiere}
          onChange={(e) => setRequiere(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-600"
        />
        ¿Requiere medicamento ahora?
      </label>

      {requiere && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
          <TextField
            label="Enfermedad / motivo"
            placeholder="Ej. Fiebre, herida en pata"
            autoFocus
            registration={register('enfermedad')}
            error={errors.enfermedad?.message}
          />
          <TextField label="Medicamento" registration={register('medicamento')} error={errors.medicamento?.message} />
          <div className="flex gap-2">
            <div className="flex-1">
              <TextField label="Dosis" registration={register('dosis')} error={errors.dosis?.message} />
            </div>
            <div className="w-28">
              <TextField
                label="Costo"
                type="number"
                step="0.01"
                registration={register('costo', { valueAsNumber: true })}
                error={errors.costo?.message}
              />
            </div>
          </div>
          <Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
            {isSubmitting ? 'Guardando…' : 'Guardar medicamento'}
          </Button>
        </form>
      )}
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
    </div>
  );
}
