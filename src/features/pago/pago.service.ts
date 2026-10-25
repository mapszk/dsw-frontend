import { apiClient } from '@/lib/api-client';
import type { EstadoPago, MetodoPago } from '@/types/models';

export { ESTADOS_PAGO, METODOS_PAGO, METODOS_PAGO_MANUALES } from '@/types/models';
export type { EstadoPago, MetodoPago, MetodoPagoManual } from '@/types/models';

export interface PagoListado {
  id: number;
  fecha: string;
  metodo: MetodoPago;
  estado: EstadoPago;
  monto: string;
  reservaId: number;
  reserva?: { id: number; patente: string };
}

export interface FiltrosPagos {
  estado?: EstadoPago;
  metodo?: MetodoPago;
}

export const pagoService = {
  list: (filtros: FiltrosPagos = {}) => {
    const params = new URLSearchParams();
    if (filtros.estado) params.set('estado', filtros.estado);
    if (filtros.metodo) params.set('metodo', filtros.metodo);
    const texto = params.toString();
    return apiClient.get<PagoListado[]>(`/pagos${texto ? `?${texto}` : ''}`);
  },
};