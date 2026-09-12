import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Users } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { useRoles } from '../../hooks/useRoles';
import { createUser, updateUserRole } from '../../api/users';
import { extractErrorMessage } from '../../api/errors';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PageHeader } from '../../components/ui/PageHeader';
import { TextField } from '../../components/form/TextField';
import { SelectField } from '../../components/form/SelectField';
import type { AppUser } from '../../api/types';

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  roleId: z.string().min(1, 'Selecciona un rol'),
});
type FormValues = z.infer<typeof schema>;

export function UsersPage() {
  const { users, loading, error, reload } = useUsers();
  const { roles } = useRoles();
  const [serverError, setServerError] = useState<string | null>(null);

  const columns: Column<AppUser>[] = [
    { header: 'Nombre', render: (u) => u.nombre },
    { header: 'Email', render: (u) => u.email },
    { header: 'Rol', render: (u) => <Badge tone="green">{u.role?.nombre}</Badge> },
    {
      header: 'Cambiar rol',
      render: (u) => (
        <select
          defaultValue={u.role?.id}
          onChange={(e) => updateUserRole(u.id, e.target.value).then(reload)}
          className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>
      ),
    },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { nombre: '', email: '', password: '', roleId: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await createUser(values);
      reset({ nombre: '', email: '', password: '', roleId: '' });
      await reload();
    } catch (err) {
      setServerError(extractErrorMessage(err, 'No se pudo crear el usuario.'));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={Users} title="Usuarios" description="Crea usuarios y asigna su rol de acceso" />

      {loading ? <LoadingSkeleton rows={3} /> : <DataTable columns={columns} rows={users} rowKey={(u) => u.id} />}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <Card className="max-w-lg">
        <h2 className="mb-3 text-sm font-medium text-slate-700">Nuevo usuario</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
          <TextField label="Nombre" registration={register('nombre')} error={errors.nombre?.message} />
          <TextField label="Email" type="email" registration={register('email')} error={errors.email?.message} />
          <TextField
            label="Contraseña"
            type="password"
            registration={register('password')}
            error={errors.password?.message}
          />
          <SelectField label="Rol" registration={register('roleId')} error={errors.roleId?.message}>
            <option value="">Selecciona un rol</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </SelectField>
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          <Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
            {isSubmitting ? 'Creando…' : 'Crear usuario'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
