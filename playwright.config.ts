import { defineConfig, devices } from '@playwright/test';

// Requiere la API levantada y con el seed cargado (usuarios admin@dsw.com y cliente@dsw.com)
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  // Todos los tests usan la misma base: en paralelo, las transacciones de la API sobre las mismas
  // cocheras chocan entre si (409) y los resultados dejan de ser repetibles
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'] } },
    { name: 'celular', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
