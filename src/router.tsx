import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/app-layout';
import { HomePage } from '@/pages/home-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { NuevaReservaPage } from '@/pages/nueva-reserva-page';
import { ReservaDetallePage } from '@/pages/reserva-detalle-page';
import { ReservasPage } from '@/pages/reservas-page';
import { TiposEstadiaPage } from '@/pages/tipos-estadia-page';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/reservas', element: <ReservasPage /> },
      { path: '/reservas/nueva', element: <NuevaReservaPage /> },
      { path: '/reservas/:id', element: <ReservaDetallePage /> },
      { path: '/tipos-estadia', element: <TiposEstadiaPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
