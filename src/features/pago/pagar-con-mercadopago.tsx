import { Button } from '@/components/ui/button';
import { useIniciarPagoMercadoPago } from './use-pago-mercadopago';

interface PagarConMercadoPagoProps {
  reservaId: number;
  estadoReserva: string;
  pagoAprobado: boolean;
}

export function PagarConMercadoPago({
  reservaId,
  estadoReserva,
  pagoAprobado,
}: PagarConMercadoPagoProps) {
  const iniciar = useIniciarPagoMercadoPago();

  if (estadoReserva !== 'ACTIVA' || pagoAprobado) return null;

  return (
    <div className="space-y-2">
      <Button disabled={iniciar.isPending} onClick={() => iniciar.mutate(reservaId)}>
        {iniciar.isPending ? 'Redirigiendo...' : 'Pagar con MercadoPago'}
      </Button>
      <p className="text-muted-foreground text-sm">
        También podés pagar en efectivo o por transferencia: coordinalo con la administración.
      </p>
    </div>
  );
}