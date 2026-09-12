import type { ComponentType, ReactNode } from 'react';

interface PageHeaderProps {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * Encabezado de pagina consistente en toda la app: icono en caja con degradado
 * de marca (mismo tratamiento que el login), titulo y descripcion, con un
 * espacio a la derecha para acciones (botones, controles).
 */
export function PageHeader({ icon: Icon, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-sky-500 to-accent-500 text-white shadow-md shadow-brand-500/25 ring-1 ring-inset ring-white/25">
          <Icon size={22} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
