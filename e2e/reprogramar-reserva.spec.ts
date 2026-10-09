import { expect, test } from '@playwright/test';
import { ADMIN, CLIENTE, crearReserva, ingresar, ingresarApi } from './helpers.ts';

/** "2026-10-09T09:00" en hora local, como lo escribe un <input type="datetime-local"> */
function inputLocal(fecha: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
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
