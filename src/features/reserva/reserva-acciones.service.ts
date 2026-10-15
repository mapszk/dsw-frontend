import { apiClient } from '@/lib/api-client';
import type { MetodoPago } from '@/features/pago/pago.service';

export const reservaAccionesService = {
  aprobar: (id: number) => apiClient.post<unknown>(`/reservas/${id}/aprobar`, {}),
  registrarPago: (id: number, metodo: MetodoPago) =>
    apiClient.post<unknown>(`/reservas/${id}/pagar`, { metodo }),
};
