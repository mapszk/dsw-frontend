import { z } from 'zod';

// Valores de <input type="datetime-local"> en hora local: "2026-10-09T09:00"
export const reprogramarReservaSchema = z
  .object({
    fechaInicio: z.string().min(1, 'Elegí la nueva fecha de inicio'),
    fechaFin: z.string().min(1, 'Elegí la nueva fecha de fin'),
  })
  .refine((data) => !data.fechaInicio || new Date(data.fechaInicio) > new Date(), {
    message: 'La fecha de inicio no puede estar en el pasado',
    path: ['fechaInicio'],
  })
  .refine((data) => !data.fechaInicio || !data.fechaFin || data.fechaFin > data.fechaInicio, {
    message: 'La fecha de fin debe ser posterior a la de inicio',
    path: ['fechaFin'],
  });

export type ReprogramarReservaValues = z.infer<typeof reprogramarReservaSchema>;
