import { PlusIcon } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { EmptyMessage, ErrorMessage, ListSkeleton } from '@/components/query-states';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ESTADO_RESERVA_LABEL } from '@/features/reserva/estado-reserva';
import { ReservaList } from '@/features/reserva/reserva-list';
import { useReservas } from '@/features/reserva/use-reservas';
import { ESTADOS_RESERVA, type EstadoReserva } from '@/types/models';

const TODAS = 'TODAS';

function parseEstado(valor: string | null): EstadoReserva | undefined {
  return ESTADOS_RESERVA.find((estado) => estado === valor);
}

export function ReservasPage() {
  // El filtro vive en la URL (?estado=PENDIENTE) para poder compartirlo y volver atras
  const [searchParams, setSearchParams] = useSearchParams();
  const estado = parseEstado(searchParams.get('estado'));
  const reservas = useReservas({ estado });

  const cambiarEstado = (valor: string) =>
    setSearchParams(valor === TODAS ? {} : { estado: valor }, { replace: true });

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

      <Tabs value={estado ?? TODAS} onValueChange={cambiarEstado}>
        <div className="-mx-4 overflow-x-auto overflow-y-hidden px-4 py-0.5 sm:mx-0 sm:px-0">
          <TabsList>
            <TabsTrigger value={TODAS}>Todas</TabsTrigger>
            {ESTADOS_RESERVA.map((valor) => (
              <TabsTrigger key={valor} value={valor}>
                {ESTADO_RESERVA_LABEL[valor]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {reservas.isPending ? (
        <ListSkeleton />
      ) : reservas.isError ? (
        <ErrorMessage message={reservas.error.message} onRetry={() => reservas.refetch()} />
      ) : reservas.data.length === 0 ? (
        <EmptyMessage>
          {estado
            ? `No hay reservas en estado ${ESTADO_RESERVA_LABEL[estado].toLowerCase()}.`
            : 'No hay reservas.'}
        </EmptyMessage>
      ) : (
        <ReservaList reservas={reservas.data} />
      )}
    </section>
  );
}
