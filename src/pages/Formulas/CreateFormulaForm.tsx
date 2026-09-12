import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createFormula } from '../../api/formulas';
import { extractErrorMessage } from '../../api/errors';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/form/TextField';
import { ImageUpload } from '../../components/form/ImageUpload';

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  composicion: z.string().min(1, 'La composición es requerida'),
  costoPorKilo: z.number({ message: 'Ingresa un número' }).positive('El costo debe ser mayor a 0'),
  proposito: z.string().optional(),
  frecuencia: z.string().optional(),
  instrucciones: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function CreateFormulaForm({ onCreated }: { onCreated: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      nombre: '',
      composicion: '',
      costoPorKilo: undefined,
      proposito: '',
      frecuencia: '',
      instrucciones: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await createFormula({ ...values, fotoUrl: fotoUrl ?? undefined });
      reset();
      setFotoUrl(null);
      onCreated();
    } catch (err) {
      setServerError(extractErrorMessage(err, 'No se pudo crear la fórmula.'));
    }
  };

  return (
    <Card className="max-w-md">
      <h2 className="mb-3 text-sm font-medium text-slate-700">Nueva fórmula</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        <ImageUpload label="Foto del alimento (opcional)" value={fotoUrl} onChange={setFotoUrl} />
        <TextField label="Nombre" registration={register('nombre')} error={errors.nombre?.message} />
        <TextField
          label="Composición (qué come)"
          registration={register('composicion')}
          error={errors.composicion?.message}
        />
        <TextField
          label="Costo por kilo"
          type="number"
          step="0.01"
          registration={register('costoPorKilo', { valueAsNumber: true })}
          error={errors.costoPorKilo?.message}
        />
        <TextField
          label="Propósito (por qué se usa)"
          placeholder="Ej. última etapa de engorda"
          registration={register('proposito')}
          error={errors.proposito?.message}
        />
        <TextField
          label="Frecuencia (cada cuándo)"
          placeholder="Ej. 2 veces al día"
          registration={register('frecuencia')}
          error={errors.frecuencia?.message}
        />
        <TextField
          label="Instrucciones (qué hacer)"
          placeholder="Ej. repartir en comederos limpios"
          registration={register('instrucciones')}
          error={errors.instrucciones?.message}
        />
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        <Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
          {isSubmitting ? 'Creando…' : 'Crear fórmula'}
        </Button>
      </form>
    </Card>
  );
}
