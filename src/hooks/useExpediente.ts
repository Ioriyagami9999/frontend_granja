import { useCallback, useEffect, useState } from 'react';
import { fetchExpediente } from '../api/animals';
import type { Expediente } from '../api/types';

export function useExpediente(arete: string) {
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setExpediente(await fetchExpediente(arete));
    } catch {
      setError('No se pudo cargar el expediente de este animal.');
    } finally {
      setLoading(false);
    }
  }, [arete]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { expediente, loading, error, reload };
}
