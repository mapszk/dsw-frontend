import { z } from 'zod';

const envSchema = z.object({
  // En desarrollo "/api" pasa por el proxy de Vite; en produccion va la URL completa de la API
  VITE_API_URL: z.string().min(1).default('/api'),
});

export const env = envSchema.parse(import.meta.env);
