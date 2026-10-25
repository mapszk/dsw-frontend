import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Reserva } from '@/types/models';

export function useResultadoPago(reservaId: number | null) {
  return useQuery({
    queryKey: ['reservas', reservaId, 'resultado-pago'],
    queryFn: () => apiClient.get<Reserva>(`/reservas/${reservaId}`),
    enabled: reservaId !== null,
    // El webhook puede llegar unos segundos después de volver de MercadoPago
    refetchInterval: (query) => (query.state.data?.pago?.estado === 'PENDIENTE' ? 3000 : false),
  });
}