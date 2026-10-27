
import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from '@/components/layout/app-layout';
import { GuestOnly, RequireAuth } from '@/features/auth/route-guards';
import { LoginPage } from '@/pages/login-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { NuevaReservaPage } from '@/pages/nueva-reserva-page';
import { PagoResultadoPage } from '@/pages/pago-resultado-page';
import { RegistroPage } from '@/pages/registro-page';
import { ReservaDetallePage } from '@/pages/reserva-detalle-page';
import { ReservasPage } from '@/pages/reservas-page';
import { TarifasPage } from '@/pages/tarifas-page';
import { TiposEstadiaPage } from '@/pages/tipos-estadia-page';
import { TiposVehiculoPage } from '@/pages/tipos-vehiculo-page';
import { UsuariosPage } from '@/pages/usuarios-page';
import { CocherasPage } from '@/pages/cocheras-page';
import { PagosPage } from '@/pages/pagos-page';
import { PlayasPage } from '@/pages/playas-page';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: <GuestOnly />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/registro', element: <RegistroPage /> },
        ],
      },
      {
        // Rutas disponibles para cualquier usuario autenticado.
        element: <RequireAuth />,
        children: [
          {
            path: '/',
            element: <Navigate to="/reservas" replace />,
          },
          {
            path: '/reservas',
            element: <ReservasPage />,
          },
          {
            path: '/reservas/nueva',
            element: <NuevaReservaPage />,
          },
          {
            path: '/reservas/:id',
            element: <ReservaDetallePage />,
          },

          // Retornos de MercadoPago.
          {
            path: '/pago/exito',
            element: <PagoResultadoPage tipo="exito" />,
          },
          {
            path: '/pago/fallo',
            element: <PagoResultadoPage tipo="fallo" />,
          },
          {
            path: '/pago/pendiente',
            element: <PagoResultadoPage tipo="pendiente" />,
          },
        ],
      },
      {
        // Rutas exclusivas del administrador.
        element: <RequireAuth roles={['ADMIN']} />,
        children: [
          {
            path: '/usuarios',
            element: <UsuariosPage />,
          },
          {
            path: '/tipos-vehiculo',
            element: <TiposVehiculoPage />,
          },
          {
            path: '/tipos-estadia',
            element: <TiposEstadiaPage />,
          },
          {
            path: '/tarifas',
            element: <TarifasPage />,
          },
          {
            path: '/cocheras',
            element: <CocherasPage />,
          },
          {
            path: '/pagos',
            element: <PagosPage />,
          },
          {
            path: '/playas',
            element: <PlayasPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
