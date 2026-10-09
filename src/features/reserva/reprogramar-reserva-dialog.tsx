import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatFechaHora, formatMoneda } from '@/lib/format';
import type { Reserva } from '@/types/models';
import { ReprogramarReservaForm } from './reprogramar-reserva-form';
import { useReprogramarReserva } from './use-reprogramar-reserva';

interface ReprogramarReservaDialogProps {
  /** Reserva a reprogramar; null cierra el dialogo */
  reserva: Reserva | null;
  onClose: () => void;
}

/**
 * CU3 Reprogramar reserva. Se abre desde el listado de reservas con la reserva elegida
 * (solo tiene sentido para reservas PENDIENTE: la API rechaza las demas).
 */
export function ReprogramarReservaDialog({ reserva, onClose }: ReprogramarReservaDialogProps) {
  return (
    <Dialog open={reserva !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>{reserva && <Contenido reserva={reserva} onClose={onClose} />}</DialogContent>
    </Dialog>
  );
}

function Contenido({ reserva, onClose }: { reserva: Reserva; onClose: () => void }) {
  const reprogramar = useReprogramarReserva(reserva);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Reprogramar reserva</DialogTitle>
        <DialogDescription>
          Si tu cochera no está libre en el nuevo horario, te asignamos otra de la misma playa. El
          precio se recalcula con la tarifa vigente.
        </DialogDescription>
      </DialogHeader>

      <dl className="bg-muted grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-lg p-3 text-sm">
        <dt className="text-muted-foreground">Patente</dt>
        <dd>{reserva.patente}</dd>
        <dt className="text-muted-foreground">Cochera</dt>
        <dd>
          {reserva.cochera.id} (playa {reserva.cochera.playa.sector})
        </dd>
        <dt className="text-muted-foreground">Horario actual</dt>
        <dd>
          {formatFechaHora(reserva.fechaInicio)} a {formatFechaHora(reserva.fechaFin)}
        </dd>
        <dt className="text-muted-foreground">Precio actual</dt>
        <dd>{formatMoneda(reserva.precioTotal)}</dd>
      </dl>

      <ReprogramarReservaForm
        fechaInicio={reserva.fechaInicio}
        fechaFin={reserva.fechaFin}
        isPending={reprogramar.isPending}
        onSubmit={(data) => reprogramar.mutate(data, { onSuccess: onClose })}
      />
    </>
  );
}
