import { z } from 'zod';
import { fromInputDate } from '@/lib/format';

// Los valores del formulario son strings (inputs y selects); se convierten al enviar
export const tarifaSchema = z.object({
  tipoVehiculoId: z.string().min(1, 'Elegí un tipo de vehículo'),
  tipoEstadiaId: z.string().min(1, 'Elegí un tipo de estadía'),
  valor: z
    .string()
    .trim()
    .regex(/^\d+([.,]\d{1,2})?$/, 'Ingresá un importe válido, con hasta 2 decimales')
    .refine((valor) => Number(valor.replace(',', '.')) > 0, 'El valor debe ser mayor a 0'),
  // Igual que la API: las tarifas que ya empezaron a regir son historial y no se crean ni modifican
  fechaDesde: z
    .string()
    .min(1, 'Elegí desde cuándo rige')
    .refine(
      // Vacia ya la informa el min(1)
      (fecha) => fecha === '' || new Date(fromInputDate(fecha)) > new Date(),
      'Elegí una fecha posterior a hoy',
    ),
});

export type TarifaValues = z.infer<typeof tarifaSchema>;

export interface TarifaPayload {
  tipoVehiculoId: number;
  tipoEstadiaId: number;
  valor: number;
  fechaDesde: string;
}
