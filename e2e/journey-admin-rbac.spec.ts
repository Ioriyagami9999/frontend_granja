import { test, expect } from '@playwright/test';
import { loginAsAdmin, login, uniqueSuffix } from './utils/auth';

/**
 * E2E de interfaz #2 — RBAC dinamico de punta a punta desde el panel de
 * administracion: crear un rol acotado, crear un usuario con ese rol,
 * confirmar que solo ve/puede lo que su rol permite (nada mas), ampliarle
 * el permiso desde el rol, y confirmar que aplica con un simple re-login
 * (sin cache de permisos).
 */
test('Journey UI: rol acotado -> usuario -> restriccion real -> se amplia el permiso', async ({ page }) => {
  // Journey largo (crear rol, usuario, 2 ciclos de login/logout, editar
  // permisos): el timeout por defecto de Playwright es por TEST completo,
  // no por accion, y una secuencia asi facilmente pasa de 30s.
  test.setTimeout(90_000);

  const sufijo = uniqueSuffix();
  const nombreRol = `rol-pw-${sufijo}`;
  const email = `pw-${sufijo}@granja.local`;
  const password = 'password-playwright-123';

  await test.step('login como admin y crear un rol con un unico permiso (corrales.read)', async () => {
    await loginAsAdmin(page);
    await page.getByRole('link', { name: 'Administración' }).click();
    await page.getByRole('link', { name: 'Roles y permisos' }).click();

    await page.getByLabel('Nombre del rol').fill(nombreRol);
    const createCard = page.locator('div.rounded-xl', { has: page.getByRole('heading', { name: 'Nuevo rol' }) });
    await createCard.getByText('corrales.read', { exact: true }).click();
    await createCard.getByRole('button', { name: 'Crear rol' }).click();

    await expect(page.getByRole('heading', { name: nombreRol })).toBeVisible();
  });

  await test.step('crear un usuario con ese rol', async () => {
    await page.getByRole('link', { name: 'Usuarios' }).click();
    await page.getByLabel('Nombre').fill('Usuario Playwright RBAC');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Contraseña').fill(password);
    await page.getByLabel('Rol').selectOption({ label: nombreRol });
    await page.getByRole('button', { name: 'Crear usuario' }).click();

    await expect(page.getByRole('cell', { name: email })).toBeVisible();
  });

  await test.step('cerrar sesion e iniciar sesion como el usuario nuevo', async () => {
    // El boton de cerrar sesion vive en el Sidebar de la app principal, no en
    // el panel de administracion (tema oscuro, sin Sidebar) — hay que volver.
    await page.getByRole('link', { name: 'Volver a la app' }).click();
    await page.getByLabel('Cerrar sesión').click();
    await login(page, email, password);
    // Sin animals.read, getDefaultRoute lo manda a /corrales (el primer
    // permiso que si tiene), nunca al dashboard.
    await expect(page).toHaveURL('/corrales');
  });

  await test.step('el sidebar solo muestra Corrales, y Animales no es accesible directamente', async () => {
    await expect(page.getByRole('link', { name: 'Corrales' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Animales', exact: true })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Administración' })).not.toBeVisible();

    await page.goto('/animales');
    await expect(page).toHaveURL('/corrales');
  });

  await test.step('el admin le amplia el rol con animals.read', async () => {
    await page.getByLabel('Cerrar sesión').click();
    await loginAsAdmin(page);
    await page.getByRole('link', { name: 'Administración' }).click();
    await page.getByRole('link', { name: 'Roles y permisos' }).click();

    const roleCard = page.locator('div.rounded-xl', { has: page.getByRole('heading', { name: nombreRol, exact: true }) });
    await roleCard.getByText('animals.read', { exact: true }).click();
    await roleCard.getByRole('button', { name: 'Guardar permisos' }).click();
    await expect(roleCard.getByRole('button', { name: 'Guardar permisos' })).toBeEnabled();
  });

  await test.step('el usuario, con un nuevo login, ya puede ver Animales', async () => {
    await page.getByRole('link', { name: 'Volver a la app' }).click();
    await page.getByLabel('Cerrar sesión').click();
    await login(page, email, password);
    await expect(page.getByRole('link', { name: 'Animales', exact: true })).toBeVisible();

    await page.getByRole('link', { name: 'Animales', exact: true }).click();
    await expect(page).toHaveURL('/animales');
    await expect(page.getByRole('heading', { name: 'Animales' })).toBeVisible();
  });
});
