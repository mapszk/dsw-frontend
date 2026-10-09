import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatMoneda } from '@/lib/format';
import type { Reserva } from '@/types/models';
import { reservaService, type ReprogramarReservaPayload } from './reserva.service';

/** CU3: reprograma la reserva y avisa si la API tuvo que cambiarla de cochera. */
export function useReprogramarReserva(reserva: Reserva) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReprogramarReservaPayload) => reservaService.reprogramar(reserva.id, data),
    onSuccess: (actualizada) => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      const precio = `Nuevo precio: ${formatMoneda(actualizada.precioTotal)}.`;
      if (actualizada.cochera.id !== reserva.cochera.id) {
        toast.success('Reserva reprogramada', {
          description: `Tu cochera no estaba libre en ese horario: te asignamos la cochera ${actualizada.cochera.id} (playa ${actualizada.cochera.playa.sector}). ${precio}`,
        });
      } else {
        toast.success('Reserva reprogramada', { description: precio });
      }
    },
    onError: (error) => toast.error(error.message),
  });
}
