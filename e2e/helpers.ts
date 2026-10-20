import { expect, type APIRequestContext, type Page } from '@playwright/test';

export const ADMIN = { email: 'admin@dsw.com', password: 'dsw12345' };
export const CLIENTE = { email: 'cliente@dsw.com', password: 'dsw12345' };

export async function ingresar(
  page: Page,
  { email, password }: { email: string; password: string },
) {
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).not.toHaveURL(/\/login$/);
}

/** Menos de 768px (el breakpoint md): las secciones y "Salir" estan en un menu lateral */
export function esCelular(page: Page) {
  return (page.viewportSize()?.width ?? 1280) < 768;
}

/**
 * Devuelve donde estan las secciones y "Salir": en escritorio, el encabezado; en celular,
 * el menu lateral, que se abre primero (como lo haria una persona).
 */
export async function abrirMenu(page: Page) {
  if (!esCelular(page)) return page.getByRole('banner');
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  const menu = page.getByRole('dialog');
  await expect(menu).toBeVisible();
  return menu;
}

/**
 * Navega a una seccion usando el menu. `grupo` es el desplegable que la contiene en escritorio
 * ("Estacionamiento" o "Configuracion"); en celular todas estan en el menu lateral.
 */
export async function irA(page: Page, seccion: string, grupo?: string) {
  if (esCelular(page)) {
    const menu = await abrirMenu(page);
    await menu.getByRole('link', { name: seccion }).click();
  } else if (grupo) {
    await page.getByRole('button', { name: grupo }).click();
    await page.getByRole('menuitem', { name: seccion }).click();
  } else {
    await page
      .getByRole('navigation', { name: 'Secciones' })
      .getByRole('link', { name: seccion })
      .click();
  }
  await expect(page.getByRole('heading', { name: seccion, level: 1 })).toBeVisible();
}

export async function salir(page: Page) {
  const menu = await abrirMenu(page);
  await menu.getByRole('button', { name: 'Salir' }).click();
  await expect(page).toHaveURL(/\/login$/);
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

/** Login por la API: la cookie de sesion queda guardada en `request` y se envia en los pedidos siguientes */
export async function ingresarApi(request: APIRequestContext, credenciales: typeof ADMIN) {
  const res = await request.post('/api/auth/login', { data: credenciales });
  expect(res.status()).toBe(200);
}

/** Dia al azar dentro de los proximos 3 años, para no chocar con otras reservas de la cochera */
export function diaAlAzar(hora: number) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 30 + Math.floor(Math.random() * 1000));
  fecha.setHours(hora, 0, 0, 0);
  return fecha;
}

/**
 * Crea una reserva pendiente para el cliente del seed. Si la cochera ya estaba ocupada ese dia
 * (409, por ejemplo por una corrida anterior que no termino), reintenta con otro dia
 */
export async function crearReserva(request: APIRequestContext) {
  for (let intento = 0; intento < 5; intento++) {
    const inicio = diaAlAzar(10);
    const fin = new Date(inicio.getTime() + 2 * 60 * 60_000);
    const alta = await request.post('/api/reservas', {
      data: {
        patente: 'AB123CD',
        fechaInicio: inicio.toISOString(),
        fechaFin: fin.toISOString(),
        usuarioId: 2,
        cocheraId: 1,
        tipoVehiculoId: 1,
        tipoEstadiaId: 1,
      },
    });
    if (alta.status() === 409) continue;
    expect(alta.status(), await alta.text()).toBe(201);
    const reserva = (await alta.json()) as { id: number; precioTotal: number };
    return { ...reserva, inicio };
  }
  throw new Error('No se pudo crear la reserva de prueba');
}
