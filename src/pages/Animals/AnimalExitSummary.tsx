import { Skull, Truck } from 'lucide-react';
import { resolveAssetUrl } from '../../api/client';
import type { Animal } from '../../api/types';

/** Resumen de solo lectura para un animal que ya salio del ciclo (vendido o muerto) — ya no tiene sentido ofrecerle acciones de mover/pesar/medicar. */
export function AnimalExitSummary({ animal }: { animal: Animal }) {
  if (animal.estado === 'vendido') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <Truck size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-slate-400" />
        <div className="text-sm">
          <p className="font-medium text-slate-700">Animal vendido / exportado</p>
          {animal.fechaSalida && (
            <p className="text-slate-500">Salida: {new Date(animal.fechaSalida).toLocaleDateString('es-MX')}</p>
          )}
          {animal.pesoSalida && <p className="text-slate-500">Peso de salida: {animal.pesoSalida} kg</p>}
        </div>
      </div>
    );
  }

  if (animal.estado === 'muerto') {
    const foto = resolveAssetUrl(animal.fotoMuerte);
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
        <Skull size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-red-400" />
        <div className="flex-1 text-sm">
          <p className="font-medium text-red-800">Animal fallecido</p>
          {animal.fechaMuerte && (
            <p className="text-red-700">Fecha: {new Date(animal.fechaMuerte).toLocaleDateString('es-MX')}</p>
          )}
          {animal.causaMuerte && <p className="text-red-700">Causa: {animal.causaMuerte}</p>}
          {animal.lugarMuerte && <p className="text-red-700">Lugar: {animal.lugarMuerte}</p>}
          {animal.fechaLevantamiento && (
            <p className="text-red-700">
              Cuerpo levantado: {new Date(animal.fechaLevantamiento).toLocaleDateString('es-MX')}
            </p>
          )}
          {animal.reporteMuerte && <p className="mt-1 text-red-600">{animal.reporteMuerte}</p>}
          {foto && <img src={foto} alt="" className="mt-2 h-24 w-24 rounded-lg object-cover" />}
        </div>
      </div>
    );
  }

  return null;
}
