import type { ReactNode } from 'react';

type Tone = 'green' | 'amber' | 'slate' | 'red';

const TONE_CLASSES: Record<Tone, string> = {
  green: 'bg-brand-50 text-brand-700 ring-brand-200',
  amber: 'bg-accent-50 text-accent-600 ring-accent-200',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
};

export function Badge({ children, tone = 'slate' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}
