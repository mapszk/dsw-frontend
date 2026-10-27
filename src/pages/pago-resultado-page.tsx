
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { reservaService } from '@/features/reserva/reserva.service';

type TipoResultado = 'exito' | 'fallo' | 'pendiente';

interface PagoResultadoPageProps {
  tipo: TipoResultado;
}

const CONFIGURACION = {
  exito: {
    titulo: 'Regreso de MercadoPago',
    descripcion: 'Estamos verificando el resultado de tu pago.',
  },
  fallo: {
    titulo: 'Pago no completado',
    descripcion: 'Consultá el estado de tu pago antes de intentarlo nuevamente.',
  },
  pendiente: {
    titulo: 'Pago pendiente',
    descripcion: 'Estamos verificando si tu pago fue acreditado.',
  },
};

function obtenerReservaId(params: URLSearchParams): number | null {
  const referencia =
    params.get('reservaId') ??
    params.get('reserva_id') ??
    params.get('external_reference');

  if (!referencia) return null;

  const coincidencia = referencia.match(/^(?:reserva[-_:])?(\d+)$/i);

  if (!coincidencia) return null;

  const id = Number(coincidencia[1]);

  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function obtenerMensajeEstado(
  estadoPago: string | undefined,
  estadoReserva: string,
) {
  if (estadoPago === 'APROBADO') {
    return 'Tu pago está aprobado y registrado en el sistema.';
  }

  if (estadoPago === 'RECHAZADO') {
    return 'Tu pago fue rechazado. Podés volver a tu reserva para intentar nuevamente.';
  }

  if (estadoPago === 'PENDIENTE') {
    return 'Tu pago todavía está pendiente de confirmación.';
  }

  if (estadoReserva === 'PAGADA') {
    return 'La reserva figura como pagada en el sistema.';
  }

  return 'Todavía no hay un pago confirmado para esta reserva.';
}

export function PagoResultadoPage({ tipo }: PagoResultadoPageProps) {
  const [searchParams] = useSearchParams();

  const reservaId = obtenerReservaId(searchParams);

  const paymentId =
    searchParams.get('payment_id') ??
    searchParams.get('collection_id');

  const estadoInformadoPorMP =
    searchParams.get('collection_status') ??
    searchParams.get('status');

  const preferenceId = searchParams.get('preference_id');

  const {
    data: reserva,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['reserva', reservaId],
    queryFn: () => reservaService.get(reservaId!),
    enabled: reservaId !== null,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const configuracion = CONFIGURACION[tipo];

  return (
    <div className="mx-auto w-full max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>{configuracion.titulo}</CardTitle>
          <p className="text-muted-foreground text-sm">
            {configuracion.descripcion}
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          {paymentId && (
            <p className="text-sm">
              <span className="font-medium">ID del pago: </span>
              <span className="break-all">{paymentId}</span>
            </p>
          )}

          {preferenceId && (
            <p className="text-muted-foreground text-xs">
              Referencia de preferencia: {preferenceId}
            </p>
          )}

          {reservaId === null ? (
            <div className="space-y-3">
              <p className="text-sm">
                MercadoPago devolvió el resultado, pero no se pudo
                identificar la reserva desde los parámetros de retorno.
              </p>

              {estadoInformadoPorMP && (
                <p className="text-muted-foreground text-sm">
                  Estado informado por MercadoPago:{' '}
                  {estadoInformadoPorMP}
                </p>
              )}

              <p className="text-muted-foreground text-sm">
                Este estado no confirma por sí solo que el pago esté
                registrado. Revisá tu reserva para consultar el resultado.
              </p>
            </div>
          ) : isLoading ? (
            <p className="text-sm">
              Consultando el estado real del pago...
            </p>
          ) : isError ? (
            <div className="space-y-2">
              <p className="text-sm">
                No se pudo consultar el estado de la reserva.
              </p>

              <p className="text-muted-foreground text-sm">
                {error instanceof Error
                  ? error.message
                  : 'Ocurrió un error inesperado.'}
              </p>
            </div>
          ) : reserva ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Reserva: </span>
                  #{reserva.id}
                </p>

                <p className="text-sm">
                  <span className="font-medium">
                    Estado de la reserva:{' '}
                  </span>
                  {reserva.estado}
                </p>

                <p className="text-sm">
                  <span className="font-medium">
                    Estado del pago:{' '}
                  </span>
                  {reserva.pago?.estado ?? 'Sin pago registrado'}
                </p>
              </div>

              <p className="text-sm">
                {obtenerMensajeEstado(
                  reserva.pago?.estado,
                  reserva.estado,
                )}
              </p>

              {reserva.pago?.estado === 'PENDIENTE' && (
                <p className="text-muted-foreground text-sm">
                  La confirmación puede demorar. Podés actualizar el
                  estado para consultar nuevamente.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm">
              No se encontró información de la reserva.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {reservaId !== null && (
              <Button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                {isFetching ? 'Actualizando...' : 'Actualizar estado'}
              </Button>
            )}

            {reservaId !== null && (
              <Button asChild variant="outline">
                <Link to={`/reservas/${reservaId}`}>
                  Ver mi reserva
                </Link>
              </Button>
            )}

            <Button asChild variant="outline">
              <Link to="/reservas">Volver a reservas</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
