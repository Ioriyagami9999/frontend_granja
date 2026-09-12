import { useRef, useState } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { uploadFile } from '../../api/uploads';
import { resolveAssetUrl } from '../../api/client';

interface ImageUploadProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
}

export function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch {
      setError('No se pudo subir la imagen (máx. 5MB, JPG/PNG/WEBP).');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1 flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-300 bg-slate-50">
          {value ? (
            <img src={resolveAssetUrl(value) ?? undefined} alt="" className="h-full w-full object-cover" />
          ) : (
            <Camera size={20} strokeWidth={1.75} className="text-slate-300" />
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="tap-target flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <Camera size={15} strokeWidth={2} />}
          {uploading ? 'Subiendo…' : value ? 'Cambiar foto' : 'Agregar foto'}
        </button>

        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Quitar foto"
            className="tap-target flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} strokeWidth={2} />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
