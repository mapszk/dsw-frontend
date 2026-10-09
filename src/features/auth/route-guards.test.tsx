import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import type { Usuario } from '@/types/models';
import type { AuthContextValue } from './auth-context';
import { GuestOnly, RequireAuth } from './route-guards';
import { useAuth } from './use-auth';

vi.mock('./use-auth', () => ({ useAuth: vi.fn() }));

const cliente: Usuario = {
  id: 2,
  nombre: 'Cliente Demo',
  telefono: null,
  dni: '11111111',
  email: 'cliente@dsw.com',
  rol: 'CLIENTE',
};

function sesion(usuario: Usuario | null, isLoading = false) {
  vi.mocked(useAuth).mockReturnValue({
    usuario,
    isLoading,
    iniciarSesion: vi.fn(),
    cerrarSesion: vi.fn(),
  } satisfies AuthContextValue);
}

function renderRuta(ruta: string | { pathname: string; state: unknown }) {
  const router = createMemoryRouter(
    [
      {
        element: <GuestOnly />,
        children: [{ path: '/login', element: <p>Pantalla de login</p> }],
      },
      {
        element: <RequireAuth />,
        children: [{ path: '/', element: <p>Inicio</p> }],
      },
      {
        element: <RequireAuth roles={['ADMIN']} />,
        children: [{ path: '/admin', element: <p>Seccion de admin</p> }],
      },
    ],
    { initialEntries: [ruta] },
  );
  render(<RouterProvider router={router} />);
}

describe('RequireAuth y GuestOnly', () => {
  it('redirige al login si no hay sesion', () => {
    sesion(null);
    renderRuta('/admin');

    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
  });

  it('espera mientras se valida la sesion guardada', () => {
    sesion(null, true);
    renderRuta('/');

    expect(screen.getByRole('status')).toHaveTextContent('Cargando sesión...');
  });

  it('deja pasar a un usuario logueado', () => {
    sesion(cliente);
    renderRuta('/');

    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  it('muestra sin permisos si el rol no alcanza', () => {
    sesion(cliente);
    renderRuta('/admin');

    expect(screen.getByRole('heading', { name: 'Sin permisos' })).toBeInTheDocument();
    expect(screen.queryByText('Seccion de admin')).not.toBeInTheDocument();
  });

  it('deja entrar al admin a su seccion', () => {
    sesion({ ...cliente, rol: 'ADMIN' });
    renderRuta('/admin');

    expect(screen.getByText('Seccion de admin')).toBeInTheDocument();
  });

  it('saca del login a quien ya tiene sesion', () => {
    sesion(cliente);
    renderRuta('/login');

    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  it('al iniciar sesion vuelve a la ruta protegida que se habia pedido', () => {
    sesion({ ...cliente, rol: 'ADMIN' });
    renderRuta({ pathname: '/login', state: { from: { pathname: '/admin' } } });

    expect(screen.getByText('Seccion de admin')).toBeInTheDocument();
  });
});
