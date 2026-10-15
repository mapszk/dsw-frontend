import { apiClient } from '@/lib/api-client';
import type { MetodoPago } from '@/features/pago/pago.service';

export const reservaAccionesService = {
  iniciar: (id: number) => apiClient.post<unknown>(`/reservas/${id}/iniciar`, {}),
  finalizar: (id: number, metodo: MetodoPago) =>
    apiClient.post<unknown>(`/reservas/${id}/finalizar`, { metodo }),
};