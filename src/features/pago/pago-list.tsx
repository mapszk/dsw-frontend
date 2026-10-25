import { ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatFechaHora, formatMoneda } from '@/lib/format';
import { ESTADO_PAGO_LABEL, METODO_PAGO_LABEL, VARIANTE_ESTADO_PAGO } from './etiquetas-pago';
import type { PagoListado } from './pago.service';

interface PagoListProps {
  pagos: PagoListado[];
}

export function PagoList({ pagos }: PagoListProps) {
  return (
    <>
      {/* Celular: cards */}
      <ul className="flex flex-col gap-2 md:hidden">
        {pagos.map((pago) => (
          <li key={pago.id}>
            <Link
              to={`/reservas/${pago.reservaId}`}
              className="hover:bg-muted/50 flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-medium">
                    {pago.reserva?.patente ?? `Reserva #${pago.reservaId}`}
                  </span>
                  <Badge variant="secondary">{METODO_PAGO_LABEL[pago.metodo]}</Badge>
                  <Badge variant={VARIANTE_ESTADO_PAGO[pago.estado]}>
                    {ESTADO_PAGO_LABEL[pago.estado]}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">{formatFechaHora(pago.fecha)}</p>
                <p className="text-muted-foreground text-xs">Reserva #{pago.reservaId}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1 font-medium">
                {formatMoneda(Number(pago.monto))}
                <ChevronRightIcon className="text-muted-foreground size-4" />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Tablet y escritorio: tabla */}
      <div className="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Reserva</TableHead>
              <TableHead>Patente</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagos.map((pago) => (
              <TableRow key={pago.id}>
                <TableCell>{formatFechaHora(pago.fecha)}</TableCell>
                <TableCell>#{pago.reservaId}</TableCell>
                <TableCell className="font-mono font-medium">
                  {pago.reserva?.patente ?? '-'}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{METODO_PAGO_LABEL[pago.metodo]}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={VARIANTE_ESTADO_PAGO[pago.estado]}>
                    {ESTADO_PAGO_LABEL[pago.estado]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatMoneda(Number(pago.monto))}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/reservas/${pago.reservaId}`}>Ver reserva</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}