import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="relative flex-1 overflow-y-auto">
        {/* Lavado sutil de marca detras del contenido, ecoando el degradado teal->purpura del logo */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-100/70 via-brand-50/20 to-transparent" />
        <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-accent-200/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl p-8">
          {/* key por ruta: reinicia la animacion de entrada al navegar entre paginas */}
          <div key={location.pathname} className="animate-fade-in-up">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
