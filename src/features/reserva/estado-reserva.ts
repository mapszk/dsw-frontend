import type { EstadoReserva, Rol } from '@/types/models';

export const ESTADO_RESERVA_LABEL: Record<EstadoReserva, string> = {
  PENDIENTE: 'Pendiente',
  ACTIVA: 'Activa',
  FINALIZADA: 'Finalizada',
  CANCELADA: 'Cancelada',
};

/** Solo las reservas pendientes se pueden editar */
export const puedeEditarse = (estado: EstadoReserva) => estado === 'PENDIENTE';

/**
 * Igual que la API: un CLIENTE cancela sus reservas pendientes; un ADMIN tambien una activa
 * (se libera la cochera). La reserva cancelada queda en el historial.
 */
export const puedeCancelarse = (estado: EstadoReserva, rol: Rol) =>
  estado === 'PENDIENTE' || (rol === 'ADMIN' && estado === 'ACTIVA');

/** Igual que la API: solo se eliminan reservas pendientes o canceladas, y solo un ADMIN */
export const puedeEliminarse = (estado: EstadoReserva) =>
  estado === 'PENDIENTE' || estado === 'CANCELADA';
