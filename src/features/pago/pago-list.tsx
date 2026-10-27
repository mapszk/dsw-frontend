
import { useState } from 'react';
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
import type { MetodoPago, PagoListado } from './pago.service';

const METODO_LABEL: Record<MetodoPago, string> = {
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta',
  TRANSFERENCIA: 'Transferencia',
  ONLINE: 'MercadoPago',
};

const ESTADO_PAGO_LABEL: Record<PagoListado['estado'], string> = {
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
};

type FiltroEstado = PagoListado['estado'] | 'TODOS';
type FiltroMetodo = MetodoPago | 'TODOS';

interface PagoListProps {
  pagos: PagoListado[];
}

export function PagoList({ pagos }: PagoListProps) {
  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstado>('TODOS');

  const [filtroMetodo, setFiltroMetodo] =
    useState<FiltroMetodo>('TODOS');

  const pagosFiltrados = pagos.filter((pago) => {
    const coincideEstado =
      filtroEstado === 'TODOS' || pago.estado === filtroEstado;

    const coincideMetodo =
      filtroMetodo === 'TODOS' || pago.metodo === filtroMetodo;

    return coincideEstado && coincideMetodo;
  });

  const hayFiltrosActivos =
    filtroEstado !== 'TODOS' || filtroMetodo !== 'TODOS';

  function limpiarFiltros() {
    setFiltroEstado('TODOS');
    setFiltroMetodo('TODOS');
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex min-w-40 flex-col gap-1.5">
          <label
            htmlFor="filtro-estado-pago"
            className="text-sm font-medium"
          >
            Estado
          </label>

          <select
            id="filtro-estado-pago"
            value={filtroEstado}
            onChange={(event) =>
              setFiltroEstado(event.target.value as FiltroEstado)
            }
            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="APROBADO">Aprobado</option>
            <option value="RECHAZADO">Rechazado</option>
          </select>
        </div>

        <div className="flex min-w-44 flex-col gap-1.5">
          <label
            htmlFor="filtro-metodo-pago"
            className="text-sm font-medium"
          >
            Método de pago
          </label>

          <select
            id="filtro-metodo-pago"
            value={filtroMetodo}
            onChange={(event) =>
              setFiltroMetodo(event.target.value as FiltroMetodo)
            }
            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          >
            <option value="TODOS">Todos los métodos</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="ONLINE">MercadoPago</option>
            <option value="TARJETA">Tarjeta</option>
          </select>
        </div>

        {hayFiltrosActivos && (
          <Button
            type="button"
            variant="outline"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Cantidad de resultados */}
      <p className="text-muted-foreground text-sm">
        Mostrando {pagosFiltrados.length} de {pagos.length} pagos
      </p>

      {pagosFiltrados.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground text-sm">
            No se encontraron pagos con los filtros seleccionados.
          </p>

          {hayFiltrosActivos && (
            <Button
              type="button"
              variant="outline"
              className="mt-3"
              onClick={limpiarFiltros}
            >
              Mostrar todos
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Celular: cards */}
          <ul className="flex flex-col gap-2 md:hidden">
            {pagosFiltrados.map((pago) => (
              <li key={pago.id}>
                <Link
                  to={`/reservas/${pago.reservaId}`}
                  className="hover:bg-muted/50 flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-medium">
                        {pago.reserva?.patente ??
                          `Reserva #${pago.reservaId}`}
                      </span>

                      <Badge variant="secondary">
                        {METODO_LABEL[pago.metodo]}
                      </Badge>

                      <Badge variant="outline">
                        {ESTADO_PAGO_LABEL[pago.estado]}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground text-xs">
                      {formatFechaHora(pago.fecha)}
                    </p>

                    <p className="text-muted-foreground text-xs">
                      Reserva #{pago.reservaId}
                    </p>
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
                  <TableHead className="text-right">
                    Monto
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Acciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pagosFiltrados.map((pago) => (
                  <TableRow key={pago.id}>
                    <TableCell>
                      {formatFechaHora(pago.fecha)}
                    </TableCell>

                    <TableCell>#{pago.reservaId}</TableCell>

                    <TableCell className="font-mono font-medium">
                      {pago.reserva?.patente ?? '-'}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {METODO_LABEL[pago.metodo]}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        {ESTADO_PAGO_LABEL[pago.estado]}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-medium">
                      {formatMoneda(Number(pago.monto))}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link to={`/reservas/${pago.reservaId}`}>
                          Ver reserva
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
