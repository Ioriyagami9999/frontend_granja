import { test, expect } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD, login } from './utils/auth';

test.describe('Login', () => {
  test('el logo real (BrandMark) carga correctamente en el panel de login', async ({ page }) => {
    await page.goto('/login');

    // El logo aparece dos veces en breakpoints angostos (BrandMark en el
    // formulario) y en el panel hero a partir de md — al menos una copia
    // visible debe cargar la imagen real (logo-e2e.jpg), no un icono roto.
    const logos = page.locator('img[alt="E2E Tech Solutions"]');
    await expect(logos.first()).toBeVisible();
    const loaded = await logos.first().evaluate((img: HTMLImageElement) => img.naturalWidth > 0);
    expect(loaded).toBe(true);
  });

  test('login exitoso redirige al dashboard', async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('password incorrecta muestra un mensaje de error y no navega', async ({ page }) => {
    await login(page, ADMIN_EMAIL, 'password-incorrecta');
    await expect(page.getByRole('alert')).toContainText('Credenciales inválidas');
    await expect(page).toHaveURL('/login');
  });

  test('el boton de submit esta deshabilitado hasta que el formulario es valido', async ({ page }) => {
    await page.goto('/login');
    const boton = page.getByRole('button', { name: 'Entrar' });
    await expect(boton).toBeDisabled();

    await page.getByLabel('Email').fill('no-es-un-email');
    await expect(boton).toBeDisabled();

    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Contraseña').fill(ADMIN_PASSWORD);
    await expect(boton).toBeEnabled();
  });
});
