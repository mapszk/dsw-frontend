import { ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router';
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
import type { Reserva } from '@/types/models';
import { EstadoReservaBadge } from './estado-reserva-badge';

interface ReservaListProps {
  reservas: Reserva[];
}

const cochera = (reserva: Reserva) =>
  `Playa ${reserva.cochera.playa.sector} · Cochera ${reserva.cochera.id}`;

export function ReservaList({ reservas }: ReservaListProps) {
  return (
    <>
      {/* Celular: cards */}
      <ul className="flex flex-col gap-2 md:hidden">
        {reservas.map((reserva) => (
          <li key={reserva.id}>
            <Link
              to={`/reservas/${reserva.id}`}
              className="hover:bg-muted/50 flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">{reserva.patente}</span>
                  <EstadoReservaBadge estado={reserva.estado} />
                </div>
                <p className="truncate text-sm">{reserva.usuario.nombre}</p>
                <p className="text-muted-foreground text-xs">
                  {formatFechaHora(reserva.fechaInicio)} → {formatFechaHora(reserva.fechaFin)}
                </p>
                <p className="text-muted-foreground text-xs">{cochera(reserva)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1 font-medium">
                {formatMoneda(reserva.precioTotal)}
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
              <TableHead>Patente</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden lg:table-cell">Cochera</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead className="hidden lg:table-cell">Fin</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservas.map((reserva) => (
              <TableRow key={reserva.id}>
                <TableCell className="font-mono font-medium">{reserva.patente}</TableCell>
                <TableCell>{reserva.usuario.nombre}</TableCell>
                <TableCell className="hidden lg:table-cell">{cochera(reserva)}</TableCell>
                <TableCell>{formatFechaHora(reserva.fechaInicio)}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {formatFechaHora(reserva.fechaFin)}
                </TableCell>
                <TableCell>
                  <EstadoReservaBadge estado={reserva.estado} />
                </TableCell>
                <TableCell className="text-right">{formatMoneda(reserva.precioTotal)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/reservas/${reserva.id}`}>Ver detalle</Link>
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
