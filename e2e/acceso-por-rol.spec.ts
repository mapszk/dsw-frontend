import { expect, test } from '@playwright/test';
import { abrirMenu, ADMIN, CLIENTE, esCelular, ingresar, irA, salir, unico } from './helpers.ts';

test('una ruta protegida pide login y un cliente no accede a secciones de admin', async ({
  page,
}) => {
  await page.goto('/tarifas');

  await expect(page).toHaveURL(/\/login$/);

  await ingresar(page, CLIENTE);

  // Vuelve a la ruta que habia pedido, pero sin permisos
  await expect(page).toHaveURL(/\/tarifas$/);
  await expect(page.getByRole('heading', { name: 'Sin permisos' })).toBeVisible();

  // En el menu el cliente solo tiene Reservas: ni Tarifas ni el desplegable de Configuracion
  const menu = await abrirMenu(page);
  await expect(menu.getByRole('link', { name: 'Reservas' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Tarifas' })).toHaveCount(0);
  await expect(menu.getByRole('button', { name: 'Configuración' })).toHaveCount(0);
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

  await expect(page).toHaveURL(/\/reservas$/);
  // El nombre del usuario logueado esta en el encabezado (escritorio) o en el menu lateral (celular)
  await expect((await abrirMenu(page)).getByText(nombre)).toBeVisible();
  if (esCelular(page)) await page.keyboard.press('Escape');

  await salir(page);

  await ingresar(page, ADMIN);
  await irA(page, 'Usuarios');
  // En celular los usuarios se ven como tarjetas y en escritorio como tabla: se busca lo visible
  const usuario = page.getByText(nombre, { exact: true }).filter({ visible: true });
  await expect(usuario).toBeVisible();

  await page
    .getByRole('button', { name: `Eliminar a ${nombre}` })
    .filter({ visible: true })
    .click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Eliminar' }).click();

  await expect(usuario).toHaveCount(0);
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

  // Al recargar sigue logueado: no vuelve al login
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Reservas', level: 1 })).toBeVisible();
  await expect(page).not.toHaveURL(/\/login$/);

  await salir(page);
  expect((await context.cookies()).find((cookie) => cookie.name === 'sesion')).toBeUndefined();
});

test('un cliente entra al alta de reservas y no elige cliente: reserva a su nombre', async ({
  page,
}) => {
  await page.goto('/login');
  await ingresar(page, CLIENTE);

  await irA(page, 'Reservas');
  await page.getByRole('link', { name: 'Nueva reserva' }).click();

  await expect(page).toHaveURL(/\/reservas\/nueva$/);
  await expect(page.getByText('La reserva queda a tu nombre.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sin permisos' })).toHaveCount(0);
  await expect(page.getByRole('combobox', { name: 'Cliente' })).toHaveCount(0);
  await expect(page.getByRole('combobox', { name: 'Tipo de vehículo' })).toBeVisible();
});
