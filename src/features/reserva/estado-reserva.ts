import type { EstadoReserva } from '@/types/models';

export const ESTADO_RESERVA_LABEL: Record<EstadoReserva, string> = {
  PENDIENTE: 'Pendiente',
  ACTIVA: 'Activa',
  FINALIZADA: 'Finalizada',
  CANCELADA: 'Cancelada',
};

/** Solo las reservas pendientes se pueden editar */
export const puedeEditarse = (estado: EstadoReserva) => estado === 'PENDIENTE';

/** Igual que la API: solo se eliminan reservas pendientes o canceladas */
export const puedeEliminarse = (estado: EstadoReserva) =>
  estado === 'PENDIENTE' || estado === 'CANCELADA';
