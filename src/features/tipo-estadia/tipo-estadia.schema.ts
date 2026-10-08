import { z } from 'zod';
import { UNIDADES_DURACION } from '@/lib/duracion';

export const tipoEstadiaSchema = z.object({
  tipo: z.string().trim().min(1, 'Ingresá un nombre').max(50, 'Máximo 50 caracteres'),
  cantidad: z
    .string()
    .regex(/^\d+$/, 'Ingresá un número entero')
    .refine((valor) => Number(valor) > 0, 'La duración debe ser mayor a 0'),
  unidad: z.enum(UNIDADES_DURACION.map((u) => u.value)),
});

export type TipoEstadiaFormValues = z.infer<typeof tipoEstadiaSchema>;
