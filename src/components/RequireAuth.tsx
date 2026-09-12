import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDefaultRoute } from '../utils/permissions';

interface RequireAuthProps {
  children: ReactNode;
  requiredPermission?: string;
}

export function RequireAuth({ children, requiredPermission }: RequireAuthProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredPermission && !user?.permissions.includes(requiredPermission)) {
    // No siempre a "/": un usuario sin animals.read (ej. el rol programador,
    // que solo tiene logs.read) volveria a fallar el mismo guard en bucle.
    return <Navigate to={getDefaultRoute(user?.permissions ?? [])} replace />;
  }
  return children;
}
