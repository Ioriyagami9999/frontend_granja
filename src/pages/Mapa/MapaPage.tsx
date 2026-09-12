import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, ScanLine, Fence } from 'lucide-react';
import { useCorrales } from '../../hooks/useCorrales';
import { updateCorral } from '../../api/corrales';
import { fetchSettings, updateSettings } from '../../api/settings';
import { resolveAssetUrl } from '../../api/client';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { ImageUpload } from '../../components/form/ImageUpload';
import type { Corral } from '../../api/types';

type Position = { x: number; y: number };

const DEFAULT_ASPECT = 16 / 10;

// Para corrales sin coordenadas guardadas todavia: los acomoda en una fila
// abajo del mapa para que sigan siendo visibles y arrastrables a su lugar real.
function fallbackPosition(index: number): Position {
  const perRow = 5;
  const col = index % perRow;
  const row = Math.floor(index / perRow);
  return { x: 12 + col * 19, y: 80 + row * 14 };
}

export function MapaPage() {
  const { corrales, loading } = useCorrales();
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [fondoUrl, setFondoUrl] = useState<string | null>(null);
  const [aspect, setAspect] = useState(DEFAULT_ASPECT);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    fetchSettings()
      .then((s) => setFondoUrl(s.mapaFondoUrl))
      .finally(() => setLoadingSettings(false));
  }, []);

  useEffect(() => {
    setPositions((prev) => {
      const next: Record<string, Position> = {};
      corrales.forEach((corral, index) => {
        next[corral.id] =
          prev[corral.id] ??
          (corral.posX != null && corral.posY != null
            ? { x: corral.posX, y: corral.posY }
            : fallbackPosition(index));
      });
      return next;
    });
  }, [corrales]);

  const moveLocal = (id: string, x: number, y: number) => {
    setPositions((prev) => ({ ...prev, [id]: { x, y } }));
  };

  const persist = (id: string, x: number, y: number) => {
    updateCorral(id, { posX: x, posY: y }).catch(() => {});
  };

  const handleFondoChange = async (url: string | null) => {
    setFondoUrl(url);
    if (!url) setAspect(DEFAULT_ASPECT);
    await updateSettings({ mapaFondoUrl: url }).catch(() => {});
  };

  const resolvedFondo = resolveAssetUrl(fondoUrl);

  if (loading || loadingSettings) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-4">
      <PageHeader
        icon={Map}
        title="Mapa de distribución"
        description="Sube una foto/plano del rancho y arrastra cada corral a su lugar"
        actions={
          <div className="w-full max-w-xs sm:w-auto">
            <ImageUpload label="Imagen del mapa" value={fondoUrl} onChange={handleFondoChange} />
          </div>
        }
      />

      {corrales.length === 0 ? (
        <EmptyState title="Sin corrales registrados" description="Crea corrales en la sección Corrales para ubicarlos aquí." />
      ) : (
        <div
          ref={containerRef}
          style={{ aspectRatio: aspect }}
          className="relative w-full touch-none overflow-hidden rounded-2xl border-2 border-dashed border-brand-200 bg-slate-100"
        >
          {resolvedFondo ? (
            <img
              src={resolvedFondo}
              alt="Mapa del rancho"
              draggable={false}
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth && img.naturalHeight) setAspect(img.naturalWidth / img.naturalHeight);
              }}
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-amber-50" />
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage: 'radial-gradient(circle, #38614233 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
            </>
          )}

          <div className="absolute left-3 top-3 z-30 flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
            <ScanLine size={14} strokeWidth={2.25} className="text-brand-600" />
            Trampa / Estación de escaneo
          </div>

          {corrales.map((corral) => (
            <CorralPin
              key={corral.id}
              corral={corral}
              position={positions[corral.id] ?? { x: 50, y: 50 }}
              containerRef={containerRef}
              onMove={(x, y) => moveLocal(corral.id, x, y)}
              onDragEnd={(x, y) => persist(corral.id, x, y)}
              onClick={() => navigate(`/corrales/${corral.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CorralPinProps {
  corral: Corral;
  position: Position;
  containerRef: RefObject<HTMLDivElement | null>;
  onMove: (x: number, y: number) => void;
  onDragEnd: (x: number, y: number) => void;
  onClick: () => void;
}

function CorralPin({ corral, position, containerRef, onMove, onDragEnd, onClick }: CorralPinProps) {
  const [dragging, setDragging] = useState(false);
  const movedRef = useRef(false);

  const computeXY = (e: PointerEvent): Position | null => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)),
    };
  };

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    movedRef.current = false;
    setDragging(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    const xy = computeXY(e);
    if (!xy) return;
    movedRef.current = true;
    onMove(xy.x, xy.y);
  };

  const handlePointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    setDragging(false);
    if (movedRef.current) {
      const xy = computeXY(e);
      if (xy) onDragEnd(xy.x, xy.y);
    } else {
      onClick();
    }
  };

  const foto = resolveAssetUrl(corral.fotoUrl);

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      className={`absolute flex w-28 -translate-x-1/2 -translate-y-1/2 touch-none flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white/95 p-2 text-center shadow-md backdrop-blur-sm transition-shadow ${
        dragging ? 'z-20 cursor-grabbing shadow-xl' : 'z-10 cursor-grab hover:shadow-lg'
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        {foto ? (
          <img src={foto} alt="" className="h-full w-full object-cover" />
        ) : (
          <Fence size={16} strokeWidth={1.75} className="text-slate-300" />
        )}
      </div>
      <p className="text-xs font-semibold text-slate-800">{corral.nombre}</p>
      {corral.proposito && <p className="truncate text-[10px] text-slate-500">{corral.proposito}</p>}
      <p className="text-[10px] font-medium text-brand-600">
        {corral.animalesActivos ?? 0}/{corral.capacidad}
      </p>
    </button>
  );
}
