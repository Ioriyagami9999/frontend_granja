import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFormulas } from '../hooks/useFormulas';
import { createRacion } from '../api/corrales';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TextField } from './form/TextField';
import { SelectField } from './form/SelectField';
import type { Corral } from '../api/types';

const schema = z.object({
  corralId: z.string().min(1, 'Selecciona un corral'),
  formulaId: z.string().min(1, 'Selecciona una fórmula'),
  kilosAplicados: z
    .number({ message: 'Ingresa un número' })
    .positive('Los kilos deben ser mayores a 0'),
});
type FormValues = z.infer<typeof schema>;

interface RacionFormProps {
  corrales: Corral[];
  large?: boolean;
  /** Si se da, el corral queda fijo (no se elige) — para usar dentro del detalle de un corral. */
  fixedCorral?: Corral;
  onRegistered?: () => void;
}

export function RacionForm({ corrales, large = false, fixedCorral, onRegistered }: RacionFormProps) {
  const { formulas, loading: loadingFormulas } = useFormulas();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { corralId: fixedCorral?.id ?? '', formulaId: '', kilosAplicados: undefined },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setSuccess(false);
    try {
      await createRacion(values.corralId, {
        formulaId: values.formulaId,
        kilosAplicados: values.kilosAplicados,
        fecha: new Date().toISOString(),
      });
      reset({ corralId: values.corralId, formulaId: '', kilosAplicados: undefined });
      setSuccess(true);
      onRegistered?.();
    } catch {
      setServerError('No se pudo registrar la ración.');
    }
  };

  return (
    <Card className="max-w-xl">
      <h2 className="mb-3 text-sm font-medium text-slate-700">Registrar ración del día</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        {fixedCorral ? (
          <input type="hidden" {...register('corralId')} />
        ) : (
          <SelectField label="Corral" registration={register('corralId')} error={errors.corralId?.message}>
            <option value="">Selecciona un corral</option>
            {corrales.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </SelectField>
        )}

        <SelectField
          label="Fórmula"
          registration={register('formulaId')}
          error={errors.formulaId?.message}
          disabled={loadingFormulas}
        >
          <option value="">Selecciona una fórmula</option>
          {formulas.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nombre} (${f.costoPorKilo}/kg)
            </option>
          ))}
        </SelectField>

        <TextField
          label="Kilos a aplicar"
          type="number"
          step="0.1"
          registration={register('kilosAplicados', { valueAsNumber: true })}
          error={errors.kilosAplicados?.message}
        />

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        {success && <p className="text-sm text-brand-600">Ración registrada correctamente.</p>}

        <Button type="submit" disabled={!isValid || isSubmitting} large={large} className="w-full">
          {isSubmitting ? 'Guardando…' : 'Registrar ración'}
        </Button>
      </form>
    </Card>
  );
}
