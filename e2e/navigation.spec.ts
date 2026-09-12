import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './utils/auth';

const PAGINAS_SIDEBAR: Array<{ link: string; titulo: string }> = [
  { link: 'Dashboard', titulo: 'Dashboard' },
  { link: 'Animales', titulo: 'Animales' },
  { link: 'Corrales', titulo: 'Corrales' },
  { link: 'Mapa', titulo: 'Mapa de distribución' },
  { link: 'Fórmulas', titulo: 'Fórmulas de alimento' },
  { link: 'Campo', titulo: 'Ración del día' },
];

test.describe('Navegación y consistencia visual', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  for (const { link, titulo } of PAGINAS_SIDEBAR) {
    test(`el link "${link}" del sidebar navega y muestra el encabezado con degradado de marca`, async ({ page }) => {
      await page.getByRole('link', { name: link, exact: true }).click();
      await expect(page.getByRole('heading', { name: titulo, exact: true })).toBeVisible();

      // Detalle grafico: el PageHeader siempre pone el icono en una caja con
      // el degradado brand->sky->accent (mismo tratamiento que el logo).
      const iconBox = page.locator('.bg-gradient-to-br').first();
      await expect(iconBox).toBeVisible();
    });
  }

  test('el panel de administracion (tema oscuro, separado de la operacion diaria) es accesible desde el sidebar', async ({ page }) => {
    await page.getByRole('link', { name: 'Administración' }).click();
    await expect(page).toHaveURL(/\/admin\/usuarios/);
    await expect(page.getByRole('heading', { name: 'Usuarios' })).toBeVisible();
  });

  test('cerrar sesion regresa al login y protege las rutas internas de nuevo', async ({ page }) => {
    await page.getByLabel('Cerrar sesión').click();
    await expect(page).toHaveURL('/login');

    await page.goto('/animales');
    await expect(page).toHaveURL('/login');
  });
});
