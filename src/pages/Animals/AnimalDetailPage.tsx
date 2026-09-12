import { useParams } from 'react-router-dom';
import { useExpediente } from '../../hooks/useExpediente';
import { useCorrales } from '../../hooks/useCorrales';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { BackLink } from '../../components/ui/BackLink';
import { AnimalActionsPanel } from './AnimalActionsPanel';

export function AnimalDetailPage() {
  const { arete = '' } = useParams();
  const { expediente, loading, error, reload } = useExpediente(arete);
  const { corrales } = useCorrales();

  // Solo la carga inicial muestra el skeleton. Los recargas posteriores
  // (onChanged tras guardar un pesaje/medicamento/movimiento) tambien ponen
  // loading=true, pero si ya hay datos previos hay que seguir mostrando
  // AnimalActionsPanel — si no, se desmonta y remonta en cada guardado,
  // perdiendo la pestaña activa (Tabs) y regresando siempre a la primera.
  if (loading && !expediente) return <LoadingSkeleton rows={5} />;
  if (error || !expediente) {
    return <EmptyState title="No se encontró el expediente" description={error ?? undefined} />;
  }

  return (
    <div className="space-y-4">
      <BackLink to="/animales" label="Volver a Animales" />
      <AnimalActionsPanel
        expediente={expediente}
        corrales={corrales}
        onChanged={reload}
        showExpedienteLink={false}
      />
    </div>
  );
}
