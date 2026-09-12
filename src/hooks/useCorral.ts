import { useCallback, useEffect, useState } from 'react';
import { fetchCorral, fetchRaciones, fetchAnimalesEnCorral } from '../api/corrales';
import type { AnimalEnCorral, Corral, RacionCorral } from '../api/types';

export function useCorral(id: string) {
  const [corral, setCorral] = useState<Corral | null>(null);
  const [raciones, setRaciones] = useState<RacionCorral[]>([]);
  const [animales, setAnimales] = useState<AnimalEnCorral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [corralData, racionesData, animalesData] = await Promise.all([
        fetchCorral(id),
        fetchRaciones(id),
        fetchAnimalesEnCorral(id),
      ]);
      setCorral(corralData);
      setRaciones(racionesData);
      setAnimales(animalesData);
    } catch {
      setError('No se pudo cargar la información del corral.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { corral, raciones, animales, loading, error, reload };
}
