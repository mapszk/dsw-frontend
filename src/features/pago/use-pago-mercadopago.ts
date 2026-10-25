import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api-client';
import { pagoMercadoPagoService } from './pago-mercadopago.service';

function mensajeDe(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 403) return 'No tenés permiso para pagar esta reserva';
    if (error.status === 409) return error.message;
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado';
}

export function useIniciarPagoMercadoPago() {
  return useMutation({
    mutationFn: (reservaId: number) => pagoMercadoPagoService.iniciar(reservaId),
    onSuccess: ({ initPoint }) => {
      window.location.assign(initPoint);
    },
    onError: (error) => toast.error(mensajeDe(error)),
  });
}