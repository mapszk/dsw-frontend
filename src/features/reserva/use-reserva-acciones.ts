import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { MetodoPago } from '@/features/pago/pago.service';
import { reservaAccionesService } from './reserva-acciones.service';

const mensajeDe = (error: unknown) =>
  error instanceof Error ? error.message : 'Ocurrió un error inesperado';

function useRefrescar() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all(
      ['reservas', 'cocheras', 'pagos'].map((clave) =>
        queryClient.invalidateQueries({ queryKey: [clave] }),
      ),
    );
}

export function useIniciarReserva() {
  const refrescar = useRefrescar();
  return useMutation({
    mutationFn: (id: number) => reservaAccionesService.iniciar(id),
    onSuccess: async () => {
      await refrescar();
      toast.success('Reserva iniciada');
    },
    onError: (error) => toast.error(mensajeDe(error)),
  });
}

export function useFinalizarReserva() {
  const refrescar = useRefrescar();
  return useMutation({
    mutationFn: ({ id, metodo }: { id: number; metodo: MetodoPago }) =>
      reservaAccionesService.finalizar(id, metodo),
    onSuccess: async () => {
      await refrescar();
      toast.success('Reserva finalizada y pago registrado');
    },
    onError: (error) => toast.error(mensajeDe(error)),
  });
}