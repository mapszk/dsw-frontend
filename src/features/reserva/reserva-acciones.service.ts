
import { apiClient } from '@/lib/api-client';
import type { MetodoPago } from '@/features/pago/pago.service';

interface PagoOnlineResponse {
  initPoint: string;
}

export const reservaAccionesService = {
  aprobar: (id: number) => apiClient.post<unknown>(`/reservas/${id}/aprobar`, {}),
  registrarPago: (id: number, metodo: MetodoPago) =>
    apiClient.post<unknown>(`/reservas/${id}/pagar`, { metodo }),
  iniciarPagoOnline: (id: number) =>
    apiClient.post<PagoOnlineResponse>(`/reservas/${id}/pagar`, {
      metodo: 'ONLINE',
    }),
};
