import { useCallback, useEffect, useState } from 'react';
import { fetchFormulas } from '../api/formulas';
import type { Formula } from '../api/types';

export function useFormulas() {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setFormulas(await fetchFormulas());
    } catch {
      setError('No se pudo cargar la lista de fórmulas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { formulas, loading, error, reload };
}
