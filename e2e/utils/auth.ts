import { Page, expect } from '@playwright/test';

export const ADMIN_EMAIL = 'admin@granja.local';
export const ADMIN_PASSWORD = 'change-me-123';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: /Entrar|Entrando/ }).click();
}

export async function loginAsAdmin(page: Page) {
  await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  await expect(page).toHaveURL('/dashboard');
}

/** Sufijo unico solo-letras para nombres/emails de prueba (nunca choca entre corridas). */
export function uniqueSuffix(): string {
  return Array.from({ length: 6 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
}
