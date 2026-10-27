
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { MetodoPago } from '@/features/pago/pago.service';
import { reservaAccionesService } from './reserva-acciones.service';

interface ErrorDeApi {
  status?: number;
  response?: {
    status?: number;
  };
}

function obtenerEstadoHttp(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }

  const errorApi = error as ErrorDeApi;

  return errorApi.status ?? errorApi.response?.status;
}

function mensajeDe(error: unknown): string {
  const estado = obtenerEstadoHttp(error);

  if (estado === 403) {
    return 'No tenés permisos para realizar esta operación.';
  }

  if (estado === 409) {
    return 'No se puede realizar esta operación porque la reserva o el pago ya cambió de estado. Actualizá la página e intentá nuevamente.';
  }

  if (estado === 400) {
    return 'Los datos enviados no son válidos. Revisá la información e intentá nuevamente.';
  }

  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.';
}

function useRefrescar() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all(
      ['reservas', 'reserva', 'cocheras', 'pagos'].map((clave) =>
        queryClient.invalidateQueries({
          queryKey: [clave],
        }),
      ),
    );
}

/** El ADMIN aprueba una reserva pendiente */
export function useAprobarReserva() {
  const refrescar = useRefrescar();

  return useMutation({
    mutationFn: (id: number) =>
      reservaAccionesService.aprobar(id),

    onSuccess: async () => {
      await refrescar();
      toast.success('Reserva aprobada');
    },

    onError: (error) => {
      toast.error(mensajeDe(error));
    },
  });
}

/** El ADMIN registra un pago manual */
export function useRegistrarPago() {
  const refrescar = useRefrescar();

  return useMutation({
    mutationFn: ({
      id,
      metodo,
    }: {
      id: number;
      metodo: MetodoPago;
    }) => reservaAccionesService.registrarPago(id, metodo),

    onSuccess: async () => {
      await refrescar();
      toast.success('Pago registrado correctamente');
    },

    onError: (error) => {
      toast.error(mensajeDe(error));
    },
  });
}

/** El CLIENTE inicia el checkout de MercadoPago */
export function useIniciarPagoOnline() {
  return useMutation({
    mutationFn: async (id: number) => {
      const respuesta =
        await reservaAccionesService.iniciarPagoOnline(id);

      if (
        !respuesta.initPoint ||
        typeof respuesta.initPoint !== 'string'
      ) {
        throw new Error(
          'No se recibió el enlace de pago de MercadoPago.',
        );
      }

      return respuesta;
    },

    onSuccess: ({ initPoint }) => {
      window.location.href = initPoint;
    },

    onError: (error) => {
      toast.error(mensajeDe(error));
    },
  });
}
