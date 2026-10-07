import { expect, test } from '@playwright/test';
import { ADMIN, ingresar, unico } from './helpers.ts';

test('el admin crea, edita y elimina un tipo de vehiculo', async ({ page }) => {
  const tipo = `E2E${unico()}`;
  const editado = `${tipo}B`;

  await page.goto('/login');
  await ingresar(page, ADMIN);
  await page.getByRole('link', { name: 'Tipos de vehículo' }).click();
  await expect(page.getByRole('heading', { name: 'Tipos de vehículo' })).toBeVisible();

  // Alta: la API lo guarda en mayusculas
  await page.getByRole('button', { name: 'Nuevo tipo' }).click();
  await page.getByRole('dialog').getByLabel('Tipo').fill(tipo.toLowerCase());
  await page.getByRole('dialog').getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByRole('cell', { name: tipo, exact: true })).toBeVisible();

  // Un duplicado muestra el error de la API y deja el formulario abierto
  await page.getByRole('button', { name: 'Nuevo tipo' }).click();
  await page.getByRole('dialog').getByLabel('Tipo').fill(tipo);
  await page.getByRole('dialog').getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByText('Ya existe un registro con esos datos')).toBeVisible();
  await page.keyboard.press('Escape');

  // Edicion
  await page.getByRole('button', { name: `Editar ${tipo}` }).click();
  await page.getByRole('dialog').getByLabel('Tipo').fill(editado);
  await page.getByRole('dialog').getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByRole('cell', { name: editado, exact: true })).toBeVisible();

  // Baja con confirmacion
  await page.getByRole('button', { name: `Eliminar ${editado}` }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Eliminar' }).click();
  await expect(page.getByRole('cell', { name: editado, exact: true })).toHaveCount(0);
});
