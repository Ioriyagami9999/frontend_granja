import { useCallback, useEffect, useState } from 'react';
import { fetchRoles } from '../api/roles';
import type { Role } from '../api/types';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRoles(await fetchRoles());
    } catch {
      setError('No se pudo cargar la lista de roles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { roles, loading, error, reload };
}
