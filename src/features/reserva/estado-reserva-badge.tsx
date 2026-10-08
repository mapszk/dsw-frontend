import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { EstadoReserva } from '@/types/models';
import { ESTADO_RESERVA_LABEL } from './estado-reserva';

const colores: Record<EstadoReserva, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  ACTIVA: 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200',
  FINALIZADA: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200',
  CANCELADA: 'bg-muted text-muted-foreground',
};

export function EstadoReservaBadge({ estado }: { estado: EstadoReserva }) {
  return (
    <Badge className={cn('border-transparent', colores[estado])}>
      {ESTADO_RESERVA_LABEL[estado]}
    </Badge>
  );
}
