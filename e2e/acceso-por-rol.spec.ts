import { expect, test } from '@playwright/test';
import { ADMIN, CLIENTE, ingresar, unico } from './helpers.ts';

test('una ruta protegida pide login y un cliente no accede a secciones de admin', async ({
  page,
}) => {
  await page.goto('/tarifas');

  await expect(page).toHaveURL(/\/login$/);

  await ingresar(page, CLIENTE);

  // Vuelve a la ruta que habia pedido, pero sin permisos
  await expect(page).toHaveURL(/\/tarifas$/);
  await expect(page.getByRole('heading', { name: 'Sin permisos' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Tarifas' })).toHaveCount(0);
});

test('credenciales incorrectas muestran un error', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill(CLIENTE.email);
  await page.getByLabel('Contraseña').fill('incorrecta');
  await page.getByRole('button', { name: 'Ingresar' }).click();

  await expect(page.getByRole('alert')).toHaveText('Email o contraseña incorrectos');
  await expect(page).toHaveURL(/\/login$/);
});

test('un cliente se registra, cierra sesion y el admin lo da de baja', async ({ page }) => {
  const id = unico();
  const nombre = `Cliente E2E ${id}`;

  await page.goto('/registro');
  await page.getByLabel('Nombre y apellido').fill(nombre);
  await page.getByLabel('DNI').fill(id);
  await page.getByLabel('Email').fill(`e2e${id}@prueba.com`);
  await page.getByLabel('Contraseña', { exact: true }).fill('secreto123');
  await page.getByLabel('Repetir contraseña').fill('secreto123');
  await page.getByRole('button', { name: 'Crear cuenta' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('banner').getByText(nombre)).toBeVisible();

  await page.getByRole('button', { name: 'Salir' }).click();
  await expect(page).toHaveURL(/\/login$/);

  await ingresar(page, ADMIN);
  await page.getByRole('link', { name: 'Usuarios' }).click();
  await expect(page.getByRole('cell', { name: nombre, exact: true })).toBeVisible();

  await page.getByRole('button', { name: `Eliminar a ${nombre}` }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Eliminar' }).click();

  await expect(page.getByRole('cell', { name: nombre, exact: true })).toHaveCount(0);
});

test('la sesion viaja en una cookie httpOnly, sobrevive a recargar y se borra al salir', async ({
  page,
  context,
}) => {
  await page.goto('/login');
  await ingresar(page, CLIENTE);

  const sesion = (await context.cookies()).find((cookie) => cookie.name === 'sesion');
  expect(sesion?.httpOnly).toBe(true);
  // Ni el token ni nada de la sesion queda accesible desde JavaScript
  expect(await page.evaluate<string>('document.cookie')).not.toContain('sesion');
  expect(await page.evaluate<number>('localStorage.length')).toBe(0);

  await page.reload();
  await expect(page.getByRole('button', { name: 'Salir' })).toBeVisible();

  await page.getByRole('button', { name: 'Salir' }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect((await context.cookies()).find((cookie) => cookie.name === 'sesion')).toBeUndefined();
});
