// Modelos del dominio segun el DER (espejo de los DTOs de respuesta de dsw-api).
// Los montos llegan como number y las fechas como string ISO 8601.

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

// La API no devuelve timestamps ni password de los usuarios
export interface Usuario {
  id: number;
  nombre: string;
  telefono: string | null;
  dni: string;
  email: string;
  rol: Rol;
}

export interface TipoVehiculo {
  id: number;
  tipo: string;
}

export interface TipoEstadia {
  id: number;
  tipo: string;
  duracionMinutos: number;
}

export interface Tarifa {
  id: number;
  valor: number;
  fechaDesde: string;
  tipoVehiculo: TipoVehiculo;
  tipoEstadia: TipoEstadia;
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

export interface Reserva {
  id: number;
  patente: string;
  fechaInicio: string;
  fechaFin: string;
  precioTotal: number;
  estado: EstadoReserva;
  usuario: Pick<Usuario, 'id' | 'nombre' | 'dni' | 'email' | 'telefono'>;
  cochera: Pick<Cochera, 'id' | 'techada' | 'estado'> & { playa: Pick<Playa, 'id' | 'sector'> };
  tipoVehiculo: Pick<TipoVehiculo, 'id' | 'tipo'>;
  tipoEstadia: TipoEstadia;
  pago: Pago | null;
}

export interface Pago {
  id: number;
  fecha: string;
  metodo: MetodoPago;
  monto: number;
}
