import { Link } from 'react-router-dom';
import { FileText, ArrowLeftRight, Scale, Stethoscope, LogOut } from 'lucide-react';
import { ExpedienteHeader } from './ExpedienteHeader';
import { ExpedienteHistorial } from './ExpedienteHistorial';
import { PesajeForm, MedicamentoForm } from './AddEventForms';
import { MoveCorralForm } from './MoveCorralForm';
import { BajaTab } from './BajaTab';
import { AnimalExitSummary } from './AnimalExitSummary';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import type { Corral, Expediente } from '../../api/types';

interface AnimalActionsPanelProps {
  expediente: Expediente;
  corrales: Corral[];
  onChanged: () => void;
  /** false cuando ya estamos en la pagina del expediente completo (evita el link a si misma). */
  showExpedienteLink?: boolean;
}

/**
 * Todo lo que se puede hacer con un animal: ver su resumen, moverlo de corral,
 * registrar pesaje/medicamento, darlo de baja, y ver su historial — en un solo
 * lugar, en pestañas para no saturar la pantalla al escanear. La usan tanto la
 * estacion de escaneo como la pagina de expediente.
 */
export function AnimalActionsPanel({
  expediente,
  corrales,
  onChanged,
  showExpedienteLink = true,
}: AnimalActionsPanelProps) {
  const { animal, medicamentos } = expediente;
  const activo = animal.estado === 'activo';

  return (
    <div className="space-y-4">
      <ExpedienteHeader expediente={expediente} />

      {showExpedienteLink && (
        <Link
          to={`/animales/${animal.arete}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
        >
          <FileText size={14} strokeWidth={2.25} />
          Ver expediente completo
        </Link>
      )}

      {!activo && <AnimalExitSummary animal={animal} />}

      {activo && (
        <Card>
          <Tabs
            tabs={[
              {
                id: 'mover',
                label: 'Mover de corral',
                icon: ArrowLeftRight,
                content: <MoveCorralForm animal={animal} corrales={corrales} onMoved={onChanged} />,
              },
              {
                id: 'pesaje',
                label: 'Pesaje',
                icon: Scale,
                content: <PesajeForm animalId={animal.id} onSaved={onChanged} />,
              },
              {
                id: 'medicamento',
                label: 'Medicamento',
                icon: Stethoscope,
                content: (
                  <MedicamentoForm
                    animalId={animal.id}
                    medicamentos={medicamentos}
                    enfermo={animal.enfermo}
                    onSaved={onChanged}
                  />
                ),
              },
              {
                id: 'baja',
                label: 'Baja',
                icon: LogOut,
                content: <BajaTab animal={animal} onChanged={onChanged} />,
              },
            ]}
          />
        </Card>
      )}

      <ExpedienteHistorial expediente={expediente} />
    </div>
  );
}
