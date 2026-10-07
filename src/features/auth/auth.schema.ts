import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Ingresa tu email').pipe(z.email('Email inválido')),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

// Mismas reglas que la API (dsw-api: usuario.schema.ts) para avisar antes de enviar
export const registroSchema = z
  .object({
    nombre: z.string().trim().min(1, 'Ingresa tu nombre').max(100),
    dni: z
      .string()
      .trim()
      .regex(/^\d{7,8}$/, 'El DNI debe tener 7 u 8 dígitos, sin puntos'),
    email: z.string().trim().min(1, 'Ingresa tu email').pipe(z.email('Email inválido')),
    telefono: z.union([
      z.literal(''),
      z.string().trim().min(6, 'Teléfono inválido').max(20, 'Teléfono inválido'),
    ]),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(72, 'La contraseña es demasiado larga'),
    confirmarPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmarPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarPassword'],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegistroValues = z.infer<typeof registroSchema>;
