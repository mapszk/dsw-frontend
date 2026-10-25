import { Link, useSearchParams } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ESTADO_PAGO_LABEL, VARIANTE_ESTADO_PAGO } from '@/features/pago/etiquetas-pago';
import { useResultadoPago } from '@/features/pago/use-resultado-pago';
import { formatMoneda } from '@/lib/format';
import type { EstadoPago } from '@/types/models';

type Retorno = 'exito' | 'fallo' | 'pendiente';

const TITULO: Record<Retorno, string> = {
  exito: 'Volviste de MercadoPago',
  fallo: 'El pago no se completó',
  pendiente: 'Pago en proceso',
};

const MENSAJE: Record<EstadoPago, string> = {
  APROBADO: 'El pago fue aprobado y la reserva figura como pagada.',
  PENDIENTE: 'Estamos esperando la confirmación de MercadoPago. Esta pantalla se actualiza sola.',
  RECHAZADO: 'El pago fue rechazado. Podés volver a intentarlo desde la reserva.',
};

function ResultadoPago({ retorno }: { retorno: Retorno }) {
  const [params] = useSearchParams();
  const referencia = Number(params.get('external_reference'));
  const reservaId = Number.isInteger(referencia) && referencia > 0 ? referencia : null;
  const resultado = useResultadoPago(reservaId);

  return (
    <section className="mx-auto max-w-lg space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{TITULO[retorno]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reservaId === null && (
            <p className="text-muted-foreground text-sm">No pudimos identificar la reserva.</p>
          )}

          {reservaId !== null && resultado.isPending && (
            <p className="text-muted-foreground text-sm">Consultando el estado del pago...</p>
          )}

          {resultado.isError && (
            <div className="space-y-2">
              <p className="text-destructive text-sm">{resultado.error.message}</p>
              <Button variant="outline" onClick={() => resultado.refetch()}>
                Reintentar
              </Button>
            </div>
          )}

          {resultado.data && (
            <div className="space-y-2">
              <p className="text-sm">
                Reserva {resultado.data.patente} (#{resultado.data.id})
              </p>
              {resultado.data.pago?.estado ? (
                <>
                  <Badge variant={VARIANTE_ESTADO_PAGO[resultado.data.pago.estado]}>
                    {ESTADO_PAGO_LABEL[resultado.data.pago.estado]}
                  </Badge>
                  <p className="text-sm">{MENSAJE[resultado.data.pago.estado]}</p>
                  <p className="text-muted-foreground text-sm">
                    Monto: {formatMoneda(Number(resultado.data.pago.monto))}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Todavía no hay un pago registrado para esta reserva.
                </p>
              )}
            </div>
          )}

          <Button asChild variant="outline">
            <Link to={reservaId ? `/reservas/${reservaId}` : '/reservas'}>Ir a mi reserva</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

export function PagoExitoPage() {
  return <ResultadoPago retorno="exito" />;
}

export function PagoFalloPage() {
  return <ResultadoPago retorno="fallo" />;
}

export function PagoPendientePage() {
  return <ResultadoPago retorno="pendiente" />;
}