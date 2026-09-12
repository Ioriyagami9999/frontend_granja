interface BarListItem {
  label: string;
  value: number;
}

/**
 * Lista de barras de una sola serie (magnitud por categoria). Un solo hue —
 * no requiere paleta categorica ni validador porque no codifica identidad
 * entre series, solo compara magnitudes de la misma metrica.
 */
export function BarList({ items, unit = '' }: { items: BarListItem[]; unit?: string }) {
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">{item.label}</span>
            <span className="tabular-nums text-slate-500">
              {item.value}
              {unit}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-600 transition-[width]"
              style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
