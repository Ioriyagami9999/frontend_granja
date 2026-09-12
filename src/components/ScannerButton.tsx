import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/Button';

interface ScannerButtonProps {
  onDetected: (code: string) => void;
  label?: string;
}

/**
 * Escaneo por camara (QR/codigo de barras) para el arete del animal.
 * Un lector fisico (RFID/USB) no necesita esto: se comporta como teclado y
 * escribe directo en el input enfocado, por eso los campos de arete usan autoFocus.
 */
export function ScannerButton({ onDetected, label = '📷 Escanear' }: ScannerButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open || !videoRef.current) return undefined;

    let stopScan: (() => void) | undefined;
    let cancelled = false;

    // Carga @zxing/browser bajo demanda: es una libreria pesada que solo hace
    // falta si el usuario realmente abre el escaner por camara.
    import('@zxing/browser').then(({ BrowserMultiFormatReader }) => {
      if (cancelled || !videoRef.current) return;
      new BrowserMultiFormatReader()
        .decodeFromVideoDevice(undefined, videoRef.current, (result, _err, controls) => {
          stopScan = controls.stop;
          if (result && !cancelled) {
            cancelled = true;
            onDetected(result.getText());
            controls.stop();
            setOpen(false);
          }
        })
        .catch(() => setError('No se pudo acceder a la cámara. Revisa los permisos del navegador.'));
    });

    return () => {
      cancelled = true;
      stopScan?.();
    };
  }, [open, onDetected]);

  return (
    <>
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-4">
            <p className="mb-2 text-sm font-medium text-slate-700">Apunta la cámara al código del arete</p>
            <video ref={videoRef} className="aspect-video w-full rounded-lg bg-black object-cover" muted />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <Button type="button" variant="secondary" className="mt-3 w-full" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
