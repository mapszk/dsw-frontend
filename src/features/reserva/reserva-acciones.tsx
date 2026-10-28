
import { CheckIcon, CreditCard } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAprobarReserva,
  useRegistrarPago,
  useIniciarPagoOnline,
} from './use-reserva-acciones';

type MetodoPagoManual = 'EFECTIVO' | 'TRANSFERENCIA';

const METODOS_PAGO_MANUALES: {
  value: MetodoPagoManual;
  label: string;
}[] = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
];

/** El ADMIN aprueba una reserva pendiente: pasa a activa */
export function AprobarReservaButton({ reservaId }: { reservaId: number }) {
  const aprobar = useAprobarReserva();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={aprobar.isPending}>
          <CheckIcon /> Aprobar
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Aprobar la reserva?</AlertDialogTitle>
          <AlertDialogDescription>
            La reserva pasa a activa. La cochera queda reservada
            para ese horario.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => aprobar.mutate(reservaId)}
          >
            Aprobar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** El ADMIN registra manualmente el pago de una reserva activa */
export function RegistrarPagoButton({ reservaId }: { reservaId: number }) {
  const [abierto, setAbierto] = useState(false);

  const [metodo, setMetodo] =
    useState<MetodoPagoManual>('EFECTIVO');

  const registrar = useRegistrarPago();

  function confirmarPago() {
    registrar.mutate(
      { id: reservaId, metodo },
      {
        onSuccess: () => {
          setAbierto(false);
          setMetodo('EFECTIVO');
        },
      },
    );
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button>Registrar pago</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
          <DialogDescription>
            Registrá un pago manual de la reserva mediante efectivo
            o transferencia.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="metodo-pago">Método de pago</Label>

          <Select
            value={metodo}
            onValueChange={(valor) =>
              setMetodo(valor as MetodoPagoManual)
            }
          >
            <SelectTrigger id="metodo-pago" className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {METODOS_PAGO_MANUALES.map((opcion) => (
                <SelectItem
                  key={opcion.value}
                  value={opcion.value}
                >
                  {opcion.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setAbierto(false)}
            disabled={registrar.isPending}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            disabled={registrar.isPending}
            onClick={confirmarPago}
          >
            {registrar.isPending
              ? 'Registrando...'
              : 'Confirmar pago'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** El cliente inicia el checkout de MercadoPago */
export function PagarConMercadoPagoButton({
  reservaId,
}: {
  reservaId: number;
}) {
  const iniciarPago = useIniciarPagoOnline();

  return (
    <Button
      disabled={iniciarPago.isPending}
      onClick={() => iniciarPago.mutate(reservaId)}
    >
      <CreditCard />
      {iniciarPago.isPending
        ? 'Redirigiendo...'
        : 'Pagar con MercadoPago'}
    </Button>
  );
}
