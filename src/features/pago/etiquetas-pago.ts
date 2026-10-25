import type { EstadoPago, MetodoPago } from '@/types/models';

export const METODO_PAGO_LABEL: Record<MetodoPago, string> = {
  EFECTIVO: 'Efectivo',
  TRANSFERENCIA: 'Transferencia',
  MERCADOPAGO: 'MercadoPago',
};

export const ESTADO_PAGO_LABEL: Record<EstadoPago, string> = {
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
};

export const VARIANTE_ESTADO_PAGO: Record<EstadoPago, 'default' | 'secondary' | 'destructive'> = {
  APROBADO: 'default',
  PENDIENTE: 'secondary',
  RECHAZADO: 'destructive',
};