import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/app-layout';
import { GuestOnly, RequireAuth } from '@/features/auth/route-guards';
import { HomePage } from '@/pages/home-page';
import { LoginPage } from '@/pages/login-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { RegistroPage } from '@/pages/registro-page';
import { TiposVehiculoPage } from '@/pages/tipos-vehiculo-page';

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
        children: [{ path: '/', element: <HomePage /> }],
      },
      {
        element: <RequireAuth roles={['ADMIN']} />,
        children: [{ path: '/tipos-vehiculo', element: <TiposVehiculoPage /> }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
