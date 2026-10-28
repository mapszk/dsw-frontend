import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { AuthContextValue } from '@/features/auth/auth-context';
import { useAuth } from '@/features/auth/use-auth';
import type { Pago, Reserva, Usuario } from '@/types/models';
import { ReservaDetalle } from './reserva-detalle';

vi.mock('@/features/auth/use-auth', () => ({ useAuth: vi.fn() }));

const admin: Usuario = {
  id: 1,
  nombre: 'Administrador',
  telefono: null,
  dni: '00000000',
  email: 'admin@dsw.com',
  rol: 'ADMIN',
};

const cliente: Usuario = {
  id: 2,
  nombre: 'Cliente Demo',
  telefono: null,
  dni: '11111111',
  email: 'cliente@dsw.com',
  rol: 'CLIENTE',
};

function sesion(usuario: Usuario) {
  vi.mocked(useAuth).mockReturnValue({
    usuario,
    isLoading: false,
    sinConexion: false,
    reintentar: vi.fn(),
    iniciarSesion: vi.fn(),
    cerrarSesion: vi.fn(),
  } satisfies AuthContextValue);
}

function reserva(pago: Pago | null): Reserva {
  return {
    id: 10,
    patente: 'AB123CD',
    fechaInicio: '2030-01-10T12:00:00.000Z',
    fechaFin: '2030-01-10T14:00:00.000Z',
    precioTotal: 3000,
    estado: 'ACTIVA',
    usuario: cliente,
    cochera: { id: 1, techada: true, estado: 'DISPONIBLE', playa: { id: 1, sector: 'A' } },
    tipoVehiculo: { id: 1, tipo: 'AUTO' },
    tipoEstadia: { id: 1, tipo: 'Por hora', duracionMinutos: 60 },
    pago,
  };
}

const pagoRechazado: Pago = {
  id: 5,
  fecha: '2030-01-10T11:00:00.000Z',
  metodo: 'ONLINE',
  monto: 3000,
  estado: 'RECHAZADO',
};

function renderDetalle(datos: Reserva) {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ReservaDetalle reserva={datos} />
    </QueryClientProvider>,
  );
}

describe('ReservaDetalle', () => {
  it('muestra el estado del pago con su etiqueta', () => {
    sesion(admin);
    renderDetalle(reserva(pagoRechazado));

    expect(screen.getByText('Rechazado')).toBeInTheDocument();
  });

  it('con un pago online rechazado el ADMIN puede registrar el pago a mano', () => {
    sesion(admin);
    renderDetalle(reserva(pagoRechazado));

    expect(screen.getByRole('button', { name: 'Registrar pago' })).toBeInTheDocument();
  });

  it('con un pago online rechazado el cliente puede volver a pagar', () => {
    sesion(cliente);
    renderDetalle(reserva(pagoRechazado));

    expect(screen.getByRole('button', { name: 'Pagar con MercadoPago' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Registrar pago' })).not.toBeInTheDocument();
  });
});
