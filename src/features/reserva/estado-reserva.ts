import type { EstadoReserva, Reserva, Rol } from '@/types/models';

/** ACTIVA en la API significa que un admin la aprobo; todavia puede faltar el pago */
export const ESTADO_RESERVA_LABEL: Record<EstadoReserva, string> = {
  PENDIENTE: 'Pendiente',
  ACTIVA: 'Aprobada',
  PAGADA: 'Pagada',
  CANCELADA: 'Cancelada',
};

const ESTADOS_ABIERTOS: EstadoReserva[] = ['PENDIENTE', 'ACTIVA'];

const termino = (reserva: Pick<Reserva, 'fechaFin'>, ahora: Date) =>
  new Date(reserva.fechaFin) <= ahora;

/** Pendiente cuyo horario termino sin que nadie la apruebe. No cambia sola: se marca vencida */
export const estaVencida = (reserva: Pick<Reserva, 'estado' | 'fechaFin'>, ahora = new Date()) =>
  reserva.estado === 'PENDIENTE' && termino(reserva, ahora);

/** Aprobada cuyo horario termino y todavia no se registro el pago */
export const tienePagoPendiente = (
  reserva: Pick<Reserva, 'estado' | 'fechaFin'>,
  ahora = new Date(),
) => reserva.estado === 'ACTIVA' && termino(reserva, ahora);

/**
 * Pestañas del listado. Las aprobadas (pagadas o no) se separan por horario: activas hasta
 * que termina la estadia y finalizadas despues. No son estados de la API: se calculan aca.
 */
export const VISTAS_RESERVA = ['PENDIENTES', 'ACTIVAS', 'FINALIZADAS', 'CANCELADAS'] as const;
export type VistaReserva = (typeof VISTAS_RESERVA)[number];

export const VISTA_RESERVA_LABEL: Record<VistaReserva, string> = {
  PENDIENTES: 'Pendientes',
  ACTIVAS: 'Activas',
  FINALIZADAS: 'Finalizadas',
  CANCELADAS: 'Canceladas',
};

export function vistaDe(
  reserva: Pick<Reserva, 'estado' | 'fechaFin'>,
  ahora = new Date(),
): VistaReserva {
  if (reserva.estado === 'PENDIENTE') return 'PENDIENTES';
  if (reserva.estado === 'CANCELADA') return 'CANCELADAS';
  return termino(reserva, ahora) ? 'FINALIZADAS' : 'ACTIVAS';
}

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
