import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePagos } from '@/features/pago/use-pagos';

const moneda = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
const fechaHora = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' });

export function PagosPage() {
  const pagos = usePagos();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Pagos</h1>

      {pagos.isPending && <p className="text-muted-foreground">Cargando pagos...</p>}

      {pagos.isError && (
        <div className="space-y-2">
          <p className="text-destructive">{pagos.error.message}</p>
          <Button variant="outline" onClick={() => pagos.refetch()}>
            Reintentar
          </Button>
        </div>
      )}

      {pagos.data?.length === 0 && (
        <p className="text-muted-foreground">No hay pagos registrados</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pagos.data?.map((pago) => (
          <Card key={pago.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>{moneda.format(Number(pago.monto))}</span>
                <Badge variant="secondary">{pago.metodo}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>{fechaHora.format(new Date(pago.fecha))}</p>
              <p>
                Reserva{' '}
                <Link className="underline" to={`/reservas/${pago.reservaId}`}>
                  #{pago.reservaId}
                </Link>
                {pago.reserva ? ` · ${pago.reserva.patente}` : ''}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}