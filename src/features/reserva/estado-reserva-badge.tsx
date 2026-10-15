import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { EstadoReserva, Reserva } from '@/types/models';
import { ESTADO_RESERVA_LABEL, estaVencida, tienePagoPendiente } from './estado-reserva';

const colores: Record<EstadoReserva, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  ACTIVA: 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200',
  PAGADA: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200',
  CANCELADA: 'bg-muted text-muted-foreground',
};

interface EstadoReservaBadgeProps {
  reserva: Pick<Reserva, 'estado' | 'fechaFin'>;
}

export function EstadoReservaBadge({ reserva }: EstadoReservaBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <Badge className={cn('border-transparent', colores[reserva.estado])}>
        {ESTADO_RESERVA_LABEL[reserva.estado]}
      </Badge>
      {(estaVencida(reserva) || tienePagoPendiente(reserva)) && (
        <Badge variant="outline" className="text-destructive border-destructive/30">
          {estaVencida(reserva) ? 'Vencida' : 'Pago pendiente'}
        </Badge>
      )}
    </span>
  );
}
