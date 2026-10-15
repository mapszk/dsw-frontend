import { CheckIcon } from 'lucide-react';
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
import { METODOS_PAGO, type MetodoPago } from '@/features/pago/pago.service';
import { useAprobarReserva, useRegistrarPago } from './use-reserva-acciones';

const ETIQUETAS: Record<MetodoPago, string> = {
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta',
  TRANSFERENCIA: 'Transferencia',
};

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
            La reserva pasa a activa. La cochera queda reservada para ese horario.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => aprobar.mutate(reservaId)}>Aprobar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** CU2: el ADMIN registra el pago de una reserva activa y pasa a pagada */
export function RegistrarPagoButton({ reservaId }: { reservaId: number }) {
  const [abierto, setAbierto] = useState(false);
  const [metodo, setMetodo] = useState<MetodoPago>('EFECTIVO');
  const registrar = useRegistrarPago();

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button>Registrar pago</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
          <DialogDescription>
            Se registra el pago por el total de la reserva y pasa a pagada.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="metodo-pago">Método de pago</Label>
          <Select value={metodo} onValueChange={(valor) => setMetodo(valor as MetodoPago)}>
            <SelectTrigger id="metodo-pago" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METODOS_PAGO.map((opcion) => (
                <SelectItem key={opcion} value={opcion}>
                  {ETIQUETAS[opcion]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setAbierto(false)}>
            Cancelar
          </Button>
          <Button
            disabled={registrar.isPending}
            onClick={() =>
              registrar.mutate({ id: reservaId, metodo }, { onSuccess: () => setAbierto(false) })
            }
          >
            Confirmar pago
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
