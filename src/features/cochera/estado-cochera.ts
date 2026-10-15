import type { EstadoCochera } from './cochera-admin.service';

export const ESTADO_COCHERA_LABEL: Record<EstadoCochera, string> = {
  DISPONIBLE: 'Disponible',
  OCUPADA: 'Ocupada',
  INHABILITADA: 'Inhabilitada',
};

export const COLOR_ESTADO_COCHERA: Record<EstadoCochera, string> = {
  DISPONIBLE:
    'bg-emerald-100 text-emerald-900 ring-emerald-300 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-800',
  OCUPADA:
    'bg-amber-100 text-amber-900 ring-amber-300 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-800',
  INHABILITADA:
    'bg-muted text-muted-foreground ring-border hover:bg-muted/70 bg-[repeating-linear-gradient(45deg,transparent_0_6px,var(--color-border)_6px_8px)]',
};
