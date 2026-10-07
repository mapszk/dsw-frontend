import { z } from 'zod';
import { ROLES } from '@/types/models';

const password = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(72, 'La contraseña es demasiado larga');

// Mismas reglas que la API (dsw-api: usuario.schema.ts)
const base = z.object({
  nombre: z.string().trim().min(1, 'Ingresá el nombre').max(100),
  dni: z
    .string()
    .trim()
    .regex(/^\d{7,8}$/, 'El DNI debe tener 7 u 8 dígitos, sin puntos'),
  email: z.string().trim().min(1, 'Ingresá el email').pipe(z.email('Email inválido')),
  telefono: z.union([
    z.literal(''),
    z.string().trim().min(6, 'Teléfono inválido').max(20, 'Teléfono inválido'),
  ]),
  rol: z.enum(ROLES),
});

export const crearUsuarioSchema = base.extend({ password });

// Al editar, la contraseña vacía significa "no cambiarla"
export const editarUsuarioSchema = base.extend({ password: z.union([z.literal(''), password]) });

export type UsuarioValues = z.infer<typeof editarUsuarioSchema>;

export interface UsuarioPayload {
  nombre: string;
  dni: string;
  email: string;
  telefono: string | null;
  rol: (typeof ROLES)[number];
  password?: string;
}

export function toUsuarioPayload({ telefono, password, ...values }: UsuarioValues) {
  return {
    ...values,
    telefono: telefono || null,
    ...(password && { password }),
  } satisfies UsuarioPayload;
}
