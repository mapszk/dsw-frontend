import { z } from 'zod';
import { ESTADOS_COCHERA } from './cochera-admin.service';

export const cocheraFormSchema = z.object({
  techada: z.enum(['si', 'no'], { error: 'Indicá si la cochera es techada' }),
  estado: z.enum(ESTADOS_COCHERA, { error: 'Elegí un estado' }),
  playaId: z.string().min(1, 'Elegí una playa'),
});

export type CocheraFormValues = z.infer<typeof cocheraFormSchema>;