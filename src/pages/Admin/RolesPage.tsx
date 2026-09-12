import { KeyRound } from 'lucide-react';
import { useRoles } from '../../hooks/useRoles';
import { usePermissions } from '../../hooks/usePermissions';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { PageHeader } from '../../components/ui/PageHeader';
import { RoleCard } from './RoleCard';
import { CreateRoleForm } from './CreateRoleForm';

export function RolesPage() {
  const { roles, loading: loadingRoles, reload: reloadRoles } = useRoles();
  const { permissions, loading: loadingPermissions } = usePermissions();

  const loading = loadingRoles || loadingPermissions;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={KeyRound}
        title="Roles y permisos"
        description="Define qué puede hacer cada rol. Nada está fijo en el código: los permisos de cada rol se administran aquí y aplican de inmediato."
      />

      {loading ? (
        <LoadingSkeleton rows={3} />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} allPermissions={permissions} onSaved={reloadRoles} />
          ))}
        </div>
      )}

      <CreateRoleForm permissions={permissions} onSaved={reloadRoles} />
    </div>
  );
}
