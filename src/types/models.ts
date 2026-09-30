// Modelos del dominio segun el DER (espejo de prisma/schema.prisma en dsw-api).
// Los montos (Decimal en la API) llegan como string para no perder precision.
// Las fechas llegan como string ISO 8601.

export const ROLES = ['ADMIN', 'CLIENTE'] as const;
export type Rol = (typeof ROLES)[number];

export const ESTADOS_RESERVA = ['PENDIENTE', 'ACTIVA', 'FINALIZADA', 'CANCELADA'] as const;
export type EstadoReserva = (typeof ESTADOS_RESERVA)[number];

export const ESTADOS_COCHERA = ['DISPONIBLE', 'OCUPADA', 'INHABILITADA'] as const;
export type EstadoCochera = (typeof ESTADOS_COCHERA)[number];

export const METODOS_PAGO = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'] as const;
export type MetodoPago = (typeof METODOS_PAGO)[number];

interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface Usuario extends Timestamps {
  id: number;
  nombre: string;
  telefono: string | null;
  dni: string;
  email: string;
  rol: Rol;
}

export interface TipoVehiculo extends Timestamps {
  id: number;
  tipo: string;
}

export interface TipoEstadia extends Timestamps {
  id: number;
  tipo: string;
  duracionMinutos: number;
}

export interface Tarifa extends Timestamps {
  id: number;
  valor: string;
  fechaDesde: string;
  tipoVehiculoId: number;
  tipoEstadiaId: number;
  tipoVehiculo?: TipoVehiculo;
  tipoEstadia?: TipoEstadia;
}

export interface Playa extends Timestamps {
  id: number;
  sector: string;
  cocheras?: Cochera[];
}

export interface Cochera extends Timestamps {
  id: number;
  techada: boolean;
  estado: EstadoCochera;
  playaId: number;
  playa?: Playa;
}

export interface Reserva extends Timestamps {
  id: number;
  patente: string;
  fechaInicio: string;
  fechaFin: string;
  precioTotal: string;
  estado: EstadoReserva;
  usuarioId: number;
  cocheraId: number;
  tipoVehiculoId: number;
  tipoEstadiaId: number;
  usuario?: Usuario;
  cochera?: Cochera;
  tipoVehiculo?: TipoVehiculo;
  tipoEstadia?: TipoEstadia;
  pago?: Pago | null;
}

export interface Pago extends Timestamps {
  id: number;
  fecha: string;
  metodo: MetodoPago;
  monto: string;
  reservaId: number;
}
