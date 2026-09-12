import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Beef } from 'lucide-react';
import { createAnimal } from '../../api/animals';
import { extractErrorMessage } from '../../api/errors';
import { useCorrales } from '../../hooks/useCorrales';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { BackLink } from '../../components/ui/BackLink';
import { TextField } from '../../components/form/TextField';
import { SelectField } from '../../components/form/SelectField';
import { ImageUpload } from '../../components/form/ImageUpload';
import { ScannerButton } from '../../components/ScannerButton';

const schema = z.object({
  arete: z.string().min(1, 'El código de arete es requerido'),
  fechaIngreso: z.string().min(1, 'La fecha de ingreso es requerida'),
  pesoIngreso: z
    .number({ message: 'Ingresa un peso válido' })
    .positive('El peso debe ser mayor a 0'),
  corralId: z.string().min(1, 'Selecciona un corral'),
});

type FormValues = z.infer<typeof schema>;

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function AnimalNewPage() {
  const { corrales, loading: loadingCorrales } = useCorrales();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      arete: searchParams.get('arete') ?? '',
      fechaIngreso: todayIsoDate(),
      pesoIngreso: undefined,
      corralId: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const animal = await createAnimal({
        arete: values.arete,
        fechaIngreso: new Date(values.fechaIngreso).toISOString(),
        pesoIngreso: values.pesoIngreso,
        corralId: values.corralId,
        fotoUrl: fotoUrl ?? undefined,
      });
      navigate(`/animales/${animal.arete}`);
    } catch (err) {
      setServerError(extractErrorMessage(err, 'No se pudo registrar el animal.'));
    }
  };

  return (
    <div className="max-w-lg space-y-4">
      <BackLink to="/animales" label="Volver a Animales" />

      <PageHeader
        icon={Beef}
        title="Registrar animal"
        description="Escanea el arete o captúralo manualmente al ingresar el animal"
      />

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <ImageUpload label="Foto del animal (opcional)" value={fotoUrl} onChange={setFotoUrl} />

          <div className="flex items-end gap-2">
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
          </div>

          <TextField
            label="Fecha de ingreso"
            type="date"
            registration={register('fechaIngreso')}
            error={errors.fechaIngreso?.message}
          />
          <TextField
            label="Peso de ingreso (kg)"
            type="number"
            step="0.1"
            registration={register('pesoIngreso', { valueAsNumber: true })}
            error={errors.pesoIngreso?.message}
          />
          <SelectField
            label="Corral inicial"
            registration={register('corralId')}
            error={errors.corralId?.message}
            disabled={loadingCorrales}
          >
            <option value="">Selecciona un corral</option>
            {corrales.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </SelectField>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
            {isSubmitting ? 'Guardando…' : 'Registrar animal'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
