/**
 * Ruta a la que debe llegar un usuario autenticado segun sus permisos. Es
 * necesario porque el rol "programador" solo tiene logs.read (sin acceso a
 * animals.read), asi que no puede aterrizar en el dashboard operativo como
 * los demas roles.
 */
export function getDefaultRoute(permissions: string[]): string {
  if (permissions.includes('animals.read')) return '/';
  if (permissions.includes('corrales.read')) return '/corrales';
  if (permissions.includes('users.manage')) return '/admin/usuarios';
  if (permissions.includes('roles.manage')) return '/admin/roles';
  if (permissions.includes('logs.read')) return '/admin/logs';
  return '/login';
}
