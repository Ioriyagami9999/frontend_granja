import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ADMIN_LINKS = [
  { to: '/admin/usuarios', label: 'Usuarios', permission: 'users.manage' },
  { to: '/admin/roles', label: 'Roles y permisos', permission: 'roles.manage' },
  { to: '/admin/logs', label: 'Logs del sistema', permission: 'logs.read' },
];

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
  }`;

/**
 * Area de administracion visualmente separada de la app principal (tema oscuro,
 * header propio) para que quede claro que aqui se gestionan accesos y sistemas,
 * no la operacion diaria del rancho. Cada link se filtra por su propio permiso.
 */
export function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const links = ADMIN_LINKS.filter((link) => user?.permissions.includes(link.permission));

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-700 bg-slate-950 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 via-sky-500 to-accent-500 text-white shadow-sm shadow-brand-500/25 ring-1 ring-inset ring-white/25">
              <ShieldCheck size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Panel de administración</p>
              <p className="text-lg font-semibold text-white">Accesos y sistemas</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white">
            <ArrowLeft size={15} strokeWidth={2.25} />
            Volver a la app
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl gap-6 px-6 py-8">
        <nav className="flex w-48 shrink-0 flex-col gap-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 rounded-xl bg-slate-50 p-6">
          <div key={location.pathname} className="animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
