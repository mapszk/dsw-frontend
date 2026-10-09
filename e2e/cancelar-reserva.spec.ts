import { expect, test } from '@playwright/test';
import { ADMIN, CLIENTE, crearReserva, ingresar, ingresarApi } from './helpers.ts';

test('un cliente cancela su reserva pero no puede eliminarla', async ({ page, request }) => {
  await ingresarApi(request, ADMIN);
  const reserva = await crearReserva(request);

  try {
    await page.goto(`/reservas/${reserva.id}`);
    await ingresar(page, CLIENTE);

    // El cliente puede cancelar, pero no ve la opcion de eliminar
    await expect(page.getByRole('button', { name: 'Eliminar' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Cancelar reserva' }).click();

    const confirmacion = page.getByRole('alertdialog');
    await expect(confirmacion).toContainText('quedará en el historial');
    await confirmacion.getByRole('button', { name: 'Cancelar reserva' }).click();

    await expect(page.getByText('Reserva cancelada')).toBeVisible();
    await expect(page.getByText('Cancelada', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancelar reserva' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Reprogramar' })).toHaveCount(0);
  } finally {
    // El admin si puede eliminarla (asi tambien se limpia la base)
    const baja = await request.delete(`/api/reservas/${reserva.id}`);
    expect(baja.status()).toBe(204);
  }
});

test('el admin puede cancelar y eliminar una reserva', async ({ page, request }) => {
  await ingresarApi(request, ADMIN);
  const reserva = await crearReserva(request);

  await page.goto(`/reservas/${reserva.id}`);
  await ingresar(page, ADMIN);

  await page.getByRole('button', { name: 'Cancelar reserva' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Cancelar reserva' }).click();
  await expect(page.getByText('Cancelada', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Eliminar' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Eliminar' }).click();
  await expect(page).toHaveURL(/\/reservas$/);
});
