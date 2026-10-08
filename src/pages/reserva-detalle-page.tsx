import { ArrowLeftIcon, CalendarClockIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ErrorMessage, ListSkeleton } from '@/components/query-states';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditarReservaForm } from '@/features/reserva/editar-reserva-form';
import { puedeEditarse, puedeEliminarse } from '@/features/reserva/estado-reserva';
import { EstadoReservaBadge } from '@/features/reserva/estado-reserva-badge';
import { ReprogramarReservaDialog } from '@/features/reserva/reprogramar-reserva-dialog';
import { ReservaDetalle } from '@/features/reserva/reserva-detalle';
import type { ActualizarReservaInput } from '@/features/reserva/reserva.service';
import {
  useActualizarReserva,
  useEliminarReserva,
  useReserva,
} from '@/features/reserva/use-reservas';

export function ReservaDetallePage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const reserva = useReserva(id);
  const actualizar = useActualizarReserva();
  const eliminar = useEliminarReserva();
  const [editando, setEditando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [reprogramando, setReprogramando] = useState(false);

  const guardar = async (data: ActualizarReservaInput) => {
    await actualizar.mutateAsync({ id, data });
    setEditando(false);
  };

  const confirmarEliminar = () =>
    eliminar.mutate(id, { onSuccess: () => navigate('/reservas', { replace: true }) });

  return (
    <section className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" className="self-start" asChild>
        <Link to="/reservas">
          <ArrowLeftIcon /> Reservas
        </Link>
      </Button>

      {reserva.isPending ? (
        <ListSkeleton rows={3} />
      ) : reserva.isError ? (
        <ErrorMessage message={reserva.error.message} onRetry={() => reserva.refetch()} />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-heading font-mono text-2xl font-semibold">
                {reserva.data.patente}
              </h1>
              <EstadoReservaBadge estado={reserva.data.estado} />
            </div>
            <div className="flex flex-wrap gap-2">
              {puedeEditarse(reserva.data.estado) && (
                <Button variant="outline" onClick={() => setEditando(true)}>
                  <PencilIcon /> Editar
                </Button>
              )}
              {/* CU3: igual que la API, solo se reprograman reservas pendientes */}
              {puedeEditarse(reserva.data.estado) && (
                <Button variant="outline" onClick={() => setReprogramando(true)}>
                  <CalendarClockIcon /> Reprogramar
                </Button>
              )}
              {puedeEliminarse(reserva.data.estado) && (
                <Button variant="destructive" onClick={() => setConfirmando(true)}>
                  <Trash2Icon /> Eliminar
                </Button>
              )}
            </div>
          </div>

          <ReservaDetalle reserva={reserva.data} />

          <Dialog open={editando} onOpenChange={setEditando}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar reserva</DialogTitle>
                <DialogDescription>Corregí la patente del vehículo.</DialogDescription>
              </DialogHeader>
              <EditarReservaForm
                reserva={reserva.data}
                onSubmit={guardar}
                onCancel={() => setEditando(false)}
              />
            </DialogContent>
          </Dialog>

          <ConfirmDialog
            open={confirmando}
            onOpenChange={setConfirmando}
            title="¿Eliminar la reserva?"
            description={`Se eliminará la reserva de ${reserva.data.patente}. Esta acción no se puede deshacer.`}
            onConfirm={confirmarEliminar}
          />

          <ReprogramarReservaDialog
            reserva={reprogramando ? reserva.data : null}
            onClose={() => setReprogramando(false)}
          />
        </>
      )}
    </section>
  );
}
