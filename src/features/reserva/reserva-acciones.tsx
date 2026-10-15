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
import { useFinalizarReserva, useIniciarReserva } from './use-reserva-acciones';

const ETIQUETAS: Record<MetodoPago, string> = {
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta',
  TRANSFERENCIA: 'Transferencia',
};

interface ReservaAccionesProps {
  reservaId: number;
  estado: string;
  esAdmin: boolean;
}

export function ReservaAcciones({ reservaId, estado, esAdmin }: ReservaAccionesProps) {
  const [abierto, setAbierto] = useState(false);
  const [metodo, setMetodo] = useState<MetodoPago>('EFECTIVO');
  const iniciar = useIniciarReserva();
  const finalizar = useFinalizarReserva();

  if (!esAdmin) return null;

  if (estado === 'PENDIENTE') {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={iniciar.isPending}>Iniciar reserva</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Registrar el ingreso del vehículo?</AlertDialogTitle>
            <AlertDialogDescription>
              La reserva pasa a activa y la cochera queda ocupada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => iniciar.mutate(reservaId)}>Iniciar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (estado === 'ACTIVA') {
    return (
      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogTrigger asChild>
          <Button>Finalizar y cobrar</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar reserva</DialogTitle>
            <DialogDescription>
              Se registra el pago por el total de la reserva y se libera la cochera.
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
              disabled={finalizar.isPending}
              onClick={() =>
                finalizar.mutate({ id: reservaId, metodo }, { onSuccess: () => setAbierto(false) })
              }
            >
              Confirmar cobro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}