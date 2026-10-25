import { apiClient } from '@/lib/api-client';

export interface InicioPagoMercadoPago {
  initPoint: string;
}

export const pagoMercadoPagoService = {
  iniciar: (reservaId: number) =>
    apiClient.post<InicioPagoMercadoPago>(`/reservas/${reservaId}/pago/mercadopago`, {}),
};