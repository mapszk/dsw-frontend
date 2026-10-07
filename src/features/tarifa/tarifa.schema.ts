import { z } from 'zod';

// Los valores del formulario son strings (inputs y selects); se convierten al enviar
export const tarifaSchema = z.object({
  tipoVehiculoId: z.string().min(1, 'Elegí un tipo de vehículo'),
  tipoEstadiaId: z.string().min(1, 'Elegí un tipo de estadía'),
  valor: z
    .string()
    .trim()
    .regex(/^\d+([.,]\d{1,2})?$/, 'Ingresá un importe válido, con hasta 2 decimales')
    .refine((valor) => Number(valor.replace(',', '.')) > 0, 'El valor debe ser mayor a 0'),
  fechaDesde: z.string().min(1, 'Elegí desde cuándo rige'),
});

export type TarifaValues = z.infer<typeof tarifaSchema>;

export interface TarifaPayload {
  tipoVehiculoId: number;
  tipoEstadiaId: number;
  valor: number;
  fechaDesde: string;
}
