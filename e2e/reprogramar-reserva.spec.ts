import { expect, test, type APIRequestContext } from '@playwright/test';
import { ADMIN, CLIENTE, ingresar } from './helpers.ts';

/** Login por la API: la cookie de sesion queda guardada en `request` y se envia en los pedidos siguientes */
async function ingresarApi(request: APIRequestContext, credenciales: typeof ADMIN) {
  const res = await request.post('/api/auth/login', { data: credenciales });
  expect(res.status()).toBe(200);
}

/** "2026-10-09T09:00" en hora local, como lo escribe un <input type="datetime-local"> */
function inputLocal(fecha: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
}

/** Dia al azar dentro de los proximos 3 años, para no chocar con otras reservas de la cochera */
function diaAlAzar(hora: number) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 30 + Math.floor(Math.random() * 1000));
  fecha.setHours(hora, 0, 0, 0);
  return fecha;
}

/**
 * Crea una reserva pendiente para el cliente del seed. Si la cochera ya estaba ocupada ese dia
 * (409, por ejemplo por una corrida anterior que no termino), reintenta con otro dia
 */
async function crearReserva(request: APIRequestContext) {
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

test('un cliente reprograma su reserva desde el detalle (CU3)', async ({ page, request }) => {
  await ingresarApi(request, ADMIN);
  // La reserva se crea por la API: el alta por pantalla no es parte de este caso de uso
  const { inicio, ...reserva } = await crearReserva(request);

  try {
    await page.goto(`/reservas/${reserva.id}`);
    await ingresar(page, CLIENTE);

    // Mismo dia, 3 horas en lugar de 2: cambia el precio
    const nuevoInicio = new Date(inicio.getTime() + 60 * 60_000);
    const nuevoFin = new Date(nuevoInicio.getTime() + 3 * 60 * 60_000);

    await page.getByRole('button', { name: 'Reprogramar' }).click();
    const dialogo = page.getByRole('dialog');
    await dialogo.getByLabel('Nuevo inicio').fill(inputLocal(nuevoInicio));
    await dialogo.getByLabel('Nuevo fin').fill(inputLocal(nuevoFin));
    const respuesta = page.waitForResponse((res) => res.url().endsWith('/reprogramar'));
    await dialogo.getByRole('button', { name: 'Reprogramar' }).click();
    const res = await respuesta;
    expect(res.status(), await res.text()).toBe(200);

    await expect(page.getByText('Reserva reprogramada')).toBeVisible();
    await expect(dialogo).toBeHidden();

    const actualizada = await request.get(`/api/reservas/${reserva.id}`);
    const datos = (await actualizada.json()) as { fechaInicio: string; precioTotal: number };
    expect(datos.fechaInicio).toBe(nuevoInicio.toISOString());
    expect(datos.precioTotal).toBe((reserva.precioTotal / 2) * 3);
  } finally {
    await request.delete(`/api/reservas/${reserva.id}`);
  }
});
