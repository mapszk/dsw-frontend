import type { CocheraAdmin } from './cochera-admin.service';

/**
 * Lo que se ve en el plano: si el admin la inhabilito, o si esta ocupada en este momento
 * (la API lo calcula con las reservas aprobadas en curso; no es un estado guardado).
 */
export const SITUACIONES_COCHERA = ['DISPONIBLE', 'OCUPADA', 'INHABILITADA'] as const;
export type SituacionCochera = (typeof SITUACIONES_COCHERA)[number];

export function situacionDe(cochera: Pick<CocheraAdmin, 'estado' | 'ocupada'>): SituacionCochera {
  if (cochera.estado === 'INHABILITADA') return 'INHABILITADA';
  return cochera.ocupada ? 'OCUPADA' : 'DISPONIBLE';
}

export const SITUACION_COCHERA_LABEL: Record<SituacionCochera, string> = {
  DISPONIBLE: 'Disponible',
  OCUPADA: 'Ocupada ahora',
  INHABILITADA: 'Inhabilitada',
};

export const COLOR_SITUACION_COCHERA: Record<SituacionCochera, string> = {
  DISPONIBLE:
    'bg-emerald-100 text-emerald-900 ring-emerald-300 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-800',
  OCUPADA:
    'bg-amber-100 text-amber-900 ring-amber-300 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-800',
  INHABILITADA:
    'bg-muted text-muted-foreground ring-border hover:bg-muted/70 bg-[repeating-linear-gradient(45deg,transparent_0_6px,var(--color-border)_6px_8px)]',
};
