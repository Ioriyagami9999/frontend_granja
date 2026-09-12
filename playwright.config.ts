import { defineConfig, devices } from '@playwright/test';

/**
 * Prueba la interfaz real contra el backend real (localhost:3000, ver
 * .env.local) — no hay mocks. Requiere que el backend + Postgres esten
 * arriba (docker compose up -d db backend) antes de correr los tests;
 * el servidor de Vite lo levanta Playwright solo.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
