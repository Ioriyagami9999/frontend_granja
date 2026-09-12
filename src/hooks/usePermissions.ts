import { useCallback, useEffect, useState } from 'react';
import { fetchPermissions } from '../api/permissions';
import type { Permission } from '../api/types';

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPermissions(await fetchPermissions());
    } catch {
      setError('No se pudo cargar la lista de permisos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { permissions, loading, error, reload };
}
