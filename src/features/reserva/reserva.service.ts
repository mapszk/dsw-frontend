import { apiClient } from '@/lib/api-client';
import type { EstadoReserva, Reserva } from '@/types/models';

export interface ReservaFiltros {
  estado?: EstadoReserva;
  usuarioId?: number;
  cocheraId?: number;
}

export interface CrearReservaInput {
  patente: string;
  fechaInicio: string;
  fechaFin: string;
  /** Solo lo indica un ADMIN: si reserva un CLIENTE, la API usa el usuario logueado */
  usuarioId?: number;
  cocheraId: number;
  tipoVehiculoId: number;
  tipoEstadiaId: number;
}

export type ActualizarReservaInput = Pick<Reserva, 'patente'>;

export interface ReprogramarReservaPayload {
  fechaInicio: string;
  fechaFin: string;
}

function toQueryString(filtros: ReservaFiltros) {
  const params = new URLSearchParams();
  for (const [clave, valor] of Object.entries(filtros)) {
    if (valor !== undefined) params.set(clave, String(valor));
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export const reservaService = {
  list: (filtros: ReservaFiltros = {}) =>
    apiClient.get<Reserva[]>(`/reservas${toQueryString(filtros)}`),
  get: (id: number) => apiClient.get<Reserva>(`/reservas/${id}`),
  create: (data: CrearReservaInput) => apiClient.post<Reserva>('/reservas', data),
  update: (id: number, data: ActualizarReservaInput) =>
    apiClient.patch<Reserva>(`/reservas/${id}`, data),
  delete: (id: number) => apiClient.delete(`/reservas/${id}`),
  reprogramar: (id: number, data: ReprogramarReservaPayload) =>
    apiClient.post<Reserva>(`/reservas/${id}/reprogramar`, data),
};
