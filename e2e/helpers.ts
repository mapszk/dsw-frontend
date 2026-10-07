import { expect, type Page } from '@playwright/test';

export const ADMIN = { email: 'admin@dsw.com', password: 'dsw12345' };
export const CLIENTE = { email: 'cliente@dsw.com', password: 'dsw12345' };

export async function ingresar(
  page: Page,
  { email, password }: { email: string; password: string },
) {
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByRole('button', { name: 'Salir' })).toBeVisible();
}

/**
 * 8 digitos (sirve como DNI) distintos en cada llamada, para no chocar con datos de corridas
 * anteriores ni con el otro proyecto (escritorio/celular), que corre en paralelo
 */
export function unico() {
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${String(Date.now()).slice(-5)}${random}`;
}
