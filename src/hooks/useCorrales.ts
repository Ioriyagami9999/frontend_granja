import { useCallback, useEffect, useState } from 'react';
import { fetchCorrales } from '../api/corrales';
import type { Corral } from '../api/types';

export function useCorrales() {
  const [corrales, setCorrales] = useState<Corral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCorrales(await fetchCorrales());
    } catch {
      setError('No se pudo cargar la lista de corrales.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { corrales, loading, error, reload };
}
