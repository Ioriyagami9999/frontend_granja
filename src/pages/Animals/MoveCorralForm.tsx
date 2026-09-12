import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addMovimiento } from '../../api/animals';
import { extractErrorMessage } from '../../api/errors';
import { Button } from '../../components/ui/Button';
import { SelectField } from '../../components/form/SelectField';
import type { Animal, Corral } from '../../api/types';

const schema = z.object({ corralDestinoId: z.string().min(1, 'Selecciona el corral de destino') });
type FormValues = z.infer<typeof schema>;

interface MoveCorralFormProps {
  animal: Animal;
  corrales: Corral[];
  onMoved: () => void;
}

export function MoveCorralForm({ animal, corrales, onMoved }: MoveCorralFormProps) {
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
    defaultValues: { corralDestinoId: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setSuccess(false);
    try {
      await addMovimiento(animal.id, { corralDestinoId: values.corralDestinoId, fecha: new Date().toISOString() });
      reset({ corralDestinoId: '' });
      setSuccess(true);
      onMoved();
    } catch (err) {
      setServerError(extractErrorMessage(err, 'No se pudo registrar el movimiento.'));
    }
  };

  const destinos = corrales.filter((c) => c.id !== animal.corralActual?.id);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
        <SelectField label="Corral de destino" registration={register('corralDestinoId')} error={errors.corralDestinoId?.message}>
          <option value="">Selecciona un corral</option>
          {destinos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
              {c.proposito ? ` — ${c.proposito}` : ''}
            </option>
          ))}
        </SelectField>
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        {success && <p className="text-sm text-brand-600">Movimiento registrado.</p>}
        <Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
          {isSubmitting ? 'Moviendo…' : 'Mover animal'}
        </Button>
      </form>
    </div>
  );
}
