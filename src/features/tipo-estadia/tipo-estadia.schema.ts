import { z } from 'zod';

export const tipoEstadiaSchema = z.object({
  tipo: z.string().trim().min(1, 'Ingresá un nombre').max(50, 'Máximo 50 caracteres'),
  duracionMinutos: z
    .string()
    .regex(/^\d+$/, 'Ingresá un número entero de minutos')
    .refine((valor) => Number(valor) > 0, 'La duración debe ser mayor a 0'),
});

export type TipoEstadiaFormValues = z.infer<typeof tipoEstadiaSchema>;
