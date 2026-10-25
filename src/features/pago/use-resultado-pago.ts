import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export type EstadoPago = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export interface ReservaConPago {
  id: number;
  patente: string;
  estado: string;
  pago: { estado?: EstadoPago; metodo: string; monto: string } | null;
}

export function useResultadoPago(reservaId: number | null) {
  return useQuery({
    queryKey: ['reservas', reservaId, 'resultado-pago'],
    queryFn: () => apiClient.get<ReservaConPago>(`/reservas/${reservaId}`),
    enabled: reservaId !== null,
    // El webhook puede llegar unos segundos después de volver de MercadoPago
    refetchInterval: (query) => (query.state.data?.pago?.estado === 'PENDIENTE' ? 3000 : false),
  });
}