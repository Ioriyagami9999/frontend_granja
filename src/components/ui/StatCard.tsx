import type { ComponentType } from 'react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: ComponentType<{ size?: number; strokeWidth?: number }>;
}

export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <Card className="flex items-start gap-4">
      {Icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 via-sky-500 to-accent-500 text-white shadow-sm shadow-brand-500/20 ring-1 ring-inset ring-white/25">
          <Icon size={20} strokeWidth={2} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </div>
    </Card>
  );
}
