import { useCallback, useEffect, useState } from 'react';
import { fetchAnimals } from '../api/animals';
import type { Animal } from '../api/types';

export function useAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setAnimals(await fetchAnimals());
    } catch {
      setError('No se pudo cargar la lista de animales.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { animals, loading, error, reload };
}
