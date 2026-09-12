import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Beef, Fence, Wheat, Tractor, Map, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandMark } from '../BrandMark';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission?: string;
}

// La navegacion se arma segun los permisos del usuario (vienen del backend),
// nunca segun un nombre de rol fijo en el codigo. Ver skill `no-hardcoding`.
// La administracion de usuarios/roles vive aparte, en /admin (ver AdminLayout),
// no mezclada con la operacion diaria del rancho.
const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'animals.read' },
  { to: '/animales', label: 'Animales', icon: Beef, permission: 'animals.read' },
  { to: '/corrales', label: 'Corrales', icon: Fence, permission: 'corrales.read' },
  { to: '/mapa', label: 'Mapa', icon: Map, permission: 'corrales.read' },
  { to: '/formulas', label: 'Fórmulas', icon: Wheat, permission: 'formulas.read' },
  { to: '/campo', label: 'Campo', icon: Tractor, permission: 'raciones.write' },
];

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-gradient-to-r from-white/15 to-white/[0.03] text-white shadow-inner ring-1 ring-white/10'
      : 'text-brand-100 hover:bg-white/5 hover:text-white'
  }`;

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const permissions = user?.permissions ?? [];
  const links = NAV_ITEMS.filter((item) => !item.permission || permissions.includes(item.permission));
  const canAdminister = permissions.includes('users.manage') || permissions.includes('roles.manage');

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-gradient-to-b from-brand-900 via-brand-800 to-accent-900 px-4 py-6">
      <div className="mb-8 flex items-center gap-2.5 px-1">
        <BrandMark size="sm" />
        <div>
          <p className="text-base font-semibold leading-none text-white">Granja</p>
          <p className="mt-1 text-xs text-brand-300">Gestión de engorda</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink key={link.to} to={link.to} className={linkClasses}>
              <Icon size={17} strokeWidth={2} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {canAdminister && (
        <Link
          to="/admin/usuarios"
          className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-brand-100 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Settings size={17} strokeWidth={2} />
          Administración
        </Link>
      )}

      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/10 px-3 py-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500 text-sm font-semibold text-brand-900">
          {user ? initials(user.nombre) : '—'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{user?.nombre}</p>
          <p className="truncate text-xs capitalize text-brand-300">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          className="tap-target flex items-center justify-center rounded-md p-1.5 text-brand-200 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}
