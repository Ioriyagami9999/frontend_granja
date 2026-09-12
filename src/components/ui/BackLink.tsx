import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Enlace explicito para volver a la pagina anterior (lista/padre). Usa una ruta
 * fija en vez de history.back(): asi siempre funciona igual sin importar si el
 * usuario entro por un link, escribiendo la URL, o refrescando la pagina.
 */
export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-700"
    >
      <ArrowLeft size={15} strokeWidth={2.25} />
      {label}
    </Link>
  );
}
