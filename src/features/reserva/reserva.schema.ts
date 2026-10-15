import { z } from 'zod';

/** Quita espacios y guiones y pasa a mayusculas: "ab 123-cd" -> "AB123CD" */
export function normalizarPatente(valor: string) {
  return valor.replace(/[\s-]/g, '').toUpperCase();
}

// Patente argentina: ABC123 (vieja) o AB123CD (Mercosur), igual que la API
const patente = z
  .string()
  .min(1, 'Ingresá la patente')
  .refine(
    (valor) => /^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/.test(normalizarPatente(valor)),
    'Patente inválida (ej: ABC123 o AB123CD)',
  );

const opcion = (mensaje: string) => z.string().min(1, mensaje);

// Las fechas son el valor de un <input type="datetime-local"> (hora local, sin zona)
const fecha = (mensaje: string) =>
  z
    .string()
    .min(1, mensaje)
    .refine((valor) => !Number.isNaN(new Date(valor).getTime()), 'Fecha inválida');

/** El ADMIN elige el cliente de la reserva; un CLIENTE reserva a su nombre */
export function crearReservaSchema({ elegirCliente }: { elegirCliente: boolean }) {
  return z
    .object({
      patente,
      fechaInicio: fecha('Ingresá la fecha de inicio'),
      // Cantidad de unidades del tipo de estadia: el fin se calcula a partir del inicio
      cantidad: z.number().int().min(1, 'Indicá la duración'),
      usuarioId: elegirCliente ? opcion('Elegí un cliente') : z.string(),
      cocheraId: opcion('Elegí una cochera'),
      tipoVehiculoId: opcion('Elegí un tipo de vehículo'),
      tipoEstadiaId: opcion('Elegí un tipo de estadía'),
    })
    .refine((data) => !data.fechaInicio || new Date(data.fechaInicio) > new Date(), {
      message: 'La fecha de inicio no puede estar en el pasado',
      path: ['fechaInicio'],
    });
}

export const editarReservaSchema = z.object({ patente });

export type CrearReservaFormValues = z.infer<ReturnType<typeof crearReservaSchema>>;
export type EditarReservaFormValues = z.infer<typeof editarReservaSchema>;
