import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ScanLine, UserPlus } from 'lucide-react';
import { fetchExpediente } from '../../api/animals';
import { useCorrales } from '../../hooks/useCorrales';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { TextField } from '../../components/form/TextField';
import { ScannerButton } from '../../components/ScannerButton';
import { AnimalActionsPanel } from './AnimalActionsPanel';
import type { Expediente } from '../../api/types';

const schema = z.object({ arete: z.string().min(1, 'Escanea o escribe el código de arete') });
type FormValues = z.infer<typeof schema>;

export function ScanStationPage() {
  const navigate = useNavigate();
  const { corrales } = useCorrales();
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [notFoundArete, setNotFoundArete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { arete: '' },
  });

  const buscar = async (values: FormValues) => {
    const arete = values.arete.trim();
    setNotFoundArete(null);
    try {
      setExpediente(await fetchExpediente(arete));
    } catch {
      setExpediente(null);
      setNotFoundArete(arete);
    }
  };

  const refrescar = async () => {
    if (expediente) setExpediente(await fetchExpediente(expediente.animal.arete));
  };

  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader
        icon={ScanLine}
        title="Escanear animal"
        description="Escanea el arete para ver su expediente y registrar pesaje, medicamento o movimiento — o darlo de alta si es nuevo."
      />

      <Card>
        <form onSubmit={handleSubmit(buscar)} noValidate className="flex items-end gap-2">
          <div className="flex-1">
            <TextField
              label="Código de arete"
              placeholder="MX-00123"
              autoFocus
              registration={register('arete')}
              error={errors.arete?.message}
            />
          </div>
          <ScannerButton onDetected={(code) => setValue('arete', code, { shouldValidate: true })} />
          <Button type="submit" disabled={!isValid || isSubmitting}>
            Buscar
          </Button>
        </form>
      </Card>

      {notFoundArete && (
        <Card className="border-amber-200 bg-amber-50">
          <p className="text-sm font-medium text-amber-900">No existe un animal con el arete "{notFoundArete}".</p>
          <p className="mt-1 text-sm text-amber-700">¿Es un animal nuevo? Puedes darlo de alta con este mismo código.</p>
          <Button
            onClick={() => navigate(`/animales/nuevo?arete=${encodeURIComponent(notFoundArete)}`)}
            className="mt-3 flex items-center gap-1.5"
          >
            <UserPlus size={15} strokeWidth={2.25} />
            Registrar como nuevo animal
          </Button>
        </Card>
      )}

      {expediente && <AnimalActionsPanel expediente={expediente} corrales={corrales} onChanged={refrescar} />}
    </div>
  );
}
