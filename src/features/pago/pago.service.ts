
import { apiClient } from '@/lib/api-client';

export const METODOS_PAGO = [
  'EFECTIVO',
  'TARJETA',
  'TRANSFERENCIA',
] as const;

export type MetodoPago = (typeof METODOS_PAGO)[number] | 'ONLINE';

export interface PagoListado {
  id: number;
  fecha: string;
  metodo: MetodoPago;
  monto: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  reservaId: number;
  reserva?: {
    id: number;
    patente: string;
  };
}

export const pagoService = {
  list: () => apiClient.get<PagoListado[]>('/pagos'),
};
