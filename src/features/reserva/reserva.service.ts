import { apiClient } from '@/lib/api-client';
import type { Reserva } from '@/types/models';

export interface ReprogramarReservaPayload {
  fechaInicio: string;
  fechaFin: string;
}

export const reservaService = {
  reprogramar: (id: number, data: ReprogramarReservaPayload) =>
    apiClient.post<Reserva>(`/reservas/${id}/reprogramar`, data),
};
