import { useState } from 'react';
import { updateRolePermissions } from '../../api/roles';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { Permission, Role } from '../../api/types';

interface RoleCardProps {
  role: Role;
  allPermissions: Permission[];
  onSaved: () => void;
}

export function RoleCard({ role, allPermissions, onSaved }: RoleCardProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(role.permissions.map((p) => p.id)));
  const [saving, setSaving] = useState(false);

  const toggle = (permissionId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(permissionId)) next.delete(permissionId);
      else next.add(permissionId);
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateRolePermissions(role.id, [...selected]);
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-800">{role.nombre}</h3>
      {role.descripcion && <p className="text-xs text-slate-500">{role.descripcion}</p>}
      <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {allPermissions.map((permission) => (
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
      <Button variant="secondary" onClick={save} disabled={saving} className="mt-3">
        {saving ? 'Guardando…' : 'Guardar permisos'}
      </Button>
    </Card>
  );
}
