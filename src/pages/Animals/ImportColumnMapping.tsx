import { Card } from '../../components/ui/Card';
import type { FieldMapping } from './ImportPreview';

const FIELDS: { key: keyof FieldMapping; label: string }[] = [
  { key: 'arete', label: 'Código de arete' },
  { key: 'fechaIngreso', label: 'Fecha de ingreso' },
  { key: 'pesoIngreso', label: 'Peso de ingreso' },
  { key: 'corral', label: 'Corral (por nombre)' },
];

interface ImportColumnMappingProps {
  headers: string[];
  mapping: Partial<FieldMapping>;
  onChange: (field: keyof FieldMapping, header: string) => void;
}

export function ImportColumnMapping({ headers, mapping, onChange }: ImportColumnMappingProps) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-medium text-slate-700">
        Adapta las columnas de tu Excel a los datos del sistema
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-700">{field.label}</label>
            <select
              value={mapping[field.key] ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <option value="">Selecciona la columna del Excel</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </Card>
  );
}
