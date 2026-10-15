import type { EstadoReserva, Reserva, Rol } from '@/types/models';

export const ESTADO_RESERVA_LABEL: Record<EstadoReserva, string> = {
  PENDIENTE: 'Pendiente',
  ACTIVA: 'Activa',
  PAGADA: 'Pagada',
  CANCELADA: 'Cancelada',
};

const ESTADOS_ABIERTOS: EstadoReserva[] = ['PENDIENTE', 'ACTIVA'];

/**
 * Pendiente o activa con el horario ya terminado. No es un estado de la API: nada cambia solo,
 * la reserva queda asi y se marca como vencida.
 */
export const estaVencida = (reserva: Pick<Reserva, 'estado' | 'fechaFin'>, ahora = new Date()) =>
  ESTADOS_ABIERTOS.includes(reserva.estado) && new Date(reserva.fechaFin) <= ahora;

/** Solo las reservas pendientes se pueden editar */
export const puedeEditarse = (estado: EstadoReserva) => estado === 'PENDIENTE';

/**
 * Igual que la API: se cancelan reservas pendientes o activas. Un ADMIN en cualquier momento;
 * un CLIENTE solo antes de la fecha de inicio. La reserva cancelada queda en el historial.
 */
export const puedeCancelarse = (
  reserva: Pick<Reserva, 'estado' | 'fechaInicio'>,
  rol: Rol,
  ahora = new Date(),
) =>
  ESTADOS_ABIERTOS.includes(reserva.estado) &&
  (rol === 'ADMIN' || new Date(reserva.fechaInicio) > ahora);

/** Igual que la API: solo se eliminan reservas pendientes o canceladas, y solo un ADMIN */
export const puedeEliminarse = (estado: EstadoReserva) =>
  estado === 'PENDIENTE' || estado === 'CANCELADA';
