import { z } from 'zod';

export const tipoVehiculoSchema = z.object({
  tipo: z.string().trim().min(1, 'Ingresá el tipo de vehículo').max(50, 'Máximo 50 caracteres'),
});

export type TipoVehiculoValues = z.infer<typeof tipoVehiculoSchema>;
