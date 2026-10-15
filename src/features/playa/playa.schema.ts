import { z } from 'zod';

export const playaSchema = z.object({
  sector: z.string().trim().min(1, 'Ingresá un sector').max(100, 'Máximo 100 caracteres'),
});

export type PlayaFormValues = z.infer<typeof playaSchema>;