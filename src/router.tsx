import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from '@/components/layout/app-layout';
import { GuestOnly, RequireAuth } from '@/features/auth/route-guards';
import { LoginPage } from '@/pages/login-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { NuevaReservaPage } from '@/pages/nueva-reserva-page';
import { RegistroPage } from '@/pages/registro-page';
import { ReservaDetallePage } from '@/pages/reserva-detalle-page';
import { ReservasPage } from '@/pages/reservas-page';
import { TarifasPage } from '@/pages/tarifas-page';
import { TiposEstadiaPage } from '@/pages/tipos-estadia-page';
import { TiposVehiculoPage } from '@/pages/tipos-vehiculo-page';
import { UsuariosPage } from '@/pages/usuarios-page';

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
        // Cualquier usuario logueado. Las secciones de un solo rol van en <RequireAuth roles={[...]} />
        element: <RequireAuth />,
        // La API filtra las reservas: un CLIENTE solo ve las suyas
        children: [
          { path: '/', element: <Navigate to="/reservas" replace /> },
          { path: '/reservas', element: <ReservasPage /> },
          // Un ADMIN elige el cliente; un CLIENTE reserva a su nombre
          { path: '/reservas/nueva', element: <NuevaReservaPage /> },
          { path: '/reservas/:id', element: <ReservaDetallePage /> },
        ],
      },
      {
        element: <RequireAuth roles={['ADMIN']} />,
        children: [
          { path: '/usuarios', element: <UsuariosPage /> },
          { path: '/tipos-vehiculo', element: <TiposVehiculoPage /> },
          { path: '/tipos-estadia', element: <TiposEstadiaPage /> },
          { path: '/tarifas', element: <TarifasPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
