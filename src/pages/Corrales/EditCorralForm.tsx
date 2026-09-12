import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateCorral } from '../../api/corrales';
import { extractErrorMessage } from '../../api/errors';
import { useFormulas } from '../../hooks/useFormulas';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/form/TextField';
import { SelectField } from '../../components/form/SelectField';
import { ImageUpload } from '../../components/form/ImageUpload';
import type { Corral } from '../../api/types';

const schema = z.object({
  proposito: z.string().optional(),
  formulaAsignadaId: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function EditCorralForm({ corral, onSaved }: { corral: Corral; onSaved: () => void }) {
  const { formulas, loading: loadingFormulas } = useFormulas();
  const [serverError, setServerError] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(corral.fotoUrl);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      proposito: corral.proposito ?? '',
      formulaAsignadaId: corral.formulaAsignada?.id ?? '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await updateCorral(corral.id, {
        proposito: values.proposito,
        formulaAsignadaId: values.formulaAsignadaId || undefined,
        fotoUrl, // string | null — siempre se envia para poder quitar la foto si se limpia
      });
      onSaved();
    } catch (err) {
      setServerError(extractErrorMessage(err, 'No se pudo actualizar el corral.'));
    }
  };

  return (
    <Card>
      <h2 className="mb-3 text-sm font-medium text-slate-700">Para qué es este corral</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        <ImageUpload label="Foto del corral" value={fotoUrl} onChange={setFotoUrl} />
        <TextField
          label="Propósito"
          placeholder="Ej. Becerros, Terminación, Cuarentena"
          registration={register('proposito')}
        />
        <SelectField label="Fórmula que normalmente come" registration={register('formulaAsignadaId')} disabled={loadingFormulas}>
          <option value="">Sin fórmula asignada</option>
          {formulas.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nombre} {f.frecuencia ? `(${f.frecuencia})` : ''}
            </option>
          ))}
        </SelectField>
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        <Button type="submit" disabled={isSubmitting} variant="secondary" className="w-full">
          {isSubmitting ? 'Guardando…' : 'Guardar'}
        </Button>
      </form>
    </Card>
  );
}
