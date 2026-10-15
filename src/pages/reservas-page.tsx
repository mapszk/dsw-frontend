import { PlusIcon } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { EmptyMessage, ErrorMessage, ListSkeleton } from '@/components/query-states';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  VISTA_RESERVA_LABEL,
  VISTAS_RESERVA,
  vistaDe,
  type VistaReserva,
} from '@/features/reserva/estado-reserva';
import { ReservaList } from '@/features/reserva/reserva-list';
import { useReservas } from '@/features/reserva/use-reservas';

const TODAS = 'TODAS';
/** Sin filtro en la URL se muestran las pendientes, que son las que hay que atender */
const POR_DEFECTO: VistaReserva = 'PENDIENTES';

function parseVista(valor: string | null): VistaReserva | undefined {
  if (valor === TODAS) return undefined;
  return VISTAS_RESERVA.find((vista) => vista === valor) ?? POR_DEFECTO;
}

export function ReservasPage() {
  // La pestaña vive en la URL (?vista=ACTIVAS, ?vista=TODAS) para poder compartirla y volver atras
  const [searchParams, setSearchParams] = useSearchParams();
  const vista = parseVista(searchParams.get('vista'));
  // Activas y finalizadas dependen del horario, no solo del estado: se filtra aca
  const reservas = useReservas();
  const visibles = vista
    ? (reservas.data ?? []).filter((reserva) => vistaDe(reserva) === vista)
    : (reservas.data ?? []);

  const cambiarVista = (valor: string) =>
    setSearchParams(valor === POR_DEFECTO ? {} : { vista: valor }, { replace: true });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Reservas</h1>
          <p className="text-muted-foreground text-sm">Filtrá por estado y abrí el detalle.</p>
        </div>
        <Button asChild>
          <Link to="/reservas/nueva">
            <PlusIcon /> Nueva reserva
          </Link>
        </Button>
      </div>

      <Tabs value={vista ?? TODAS} onValueChange={cambiarVista}>
        <div className="-mx-4 overflow-x-auto overflow-y-hidden px-4 py-0.5 sm:mx-0 sm:px-0">
          <TabsList>
            {VISTAS_RESERVA.map((valor) => (
              <TabsTrigger key={valor} value={valor}>
                {VISTA_RESERVA_LABEL[valor]}
              </TabsTrigger>
            ))}
            <TabsTrigger value={TODAS}>Todas</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {reservas.isPending ? (
        <ListSkeleton />
      ) : reservas.isError ? (
        <ErrorMessage message={reservas.error.message} onRetry={() => reservas.refetch()} />
      ) : visibles.length === 0 ? (
        <EmptyMessage>
          {vista
            ? `No hay reservas ${VISTA_RESERVA_LABEL[vista].toLowerCase()}.`
            : 'No hay reservas.'}
        </EmptyMessage>
      ) : (
        <ReservaList reservas={visibles} />
      )}
    </section>
  );
}
