import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createRole } from '../../api/roles';
import { extractErrorMessage } from '../../api/errors';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/form/TextField';
import type { Permission } from '../../api/types';

const schema = z.object({
  nombre: z.string().min(1, 'El nombre del rol es requerido'),
  descripcion: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function CreateRoleForm({ permissions, onSaved }: { permissions: Permission[]; onSaved: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [serverError, setServerError] = useState<string | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { nombre: '', descripcion: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await createRole({ nombre: values.nombre, descripcion: values.descripcion, permissionIds: [...selected] });
      reset({ nombre: '', descripcion: '' });
      setSelected(new Set());
      onSaved();
    } catch (err) {
      setServerError(extractErrorMessage(err, 'No se pudo crear el rol (¿nombre repetido?).'));
    }
  };

  return (
    <Card className="max-w-lg">
      <h2 className="mb-3 text-sm font-medium text-slate-700">Nuevo rol</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        <TextField label="Nombre del rol" registration={register('nombre')} error={errors.nombre?.message} />
        <TextField label="Descripción" registration={register('descripcion')} error={errors.descripcion?.message} />

        <div>
          <p className="mb-1 text-sm font-medium text-slate-700">Permisos</p>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {permissions.map((permission) => (
              <label key={permission.id} className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={selected.has(permission.id)}
                  onChange={() => toggle(permission.id)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600"
                />
                <span title={permission.description}>{permission.code}</span>
              </label>
            ))}
          </div>
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        <Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
          {isSubmitting ? 'Creando…' : 'Crear rol'}
        </Button>
      </form>
    </Card>
  );
}
