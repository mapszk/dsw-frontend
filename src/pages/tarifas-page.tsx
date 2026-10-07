import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { PageHeader } from '@/components/page-header';
import { QueryState } from '@/components/query-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { calcularEstadosTarifas, type EstadoTarifa } from '@/features/tarifa/estado-tarifa';
import { TarifaForm } from '@/features/tarifa/tarifa-form';
import {
  useActualizarTarifa,
  useCrearTarifa,
  useEliminarTarifa,
  useTarifas,
} from '@/features/tarifa/use-tarifas';
import { useTiposEstadia } from '@/features/tipo-estadia/use-tipos-estadia';
import { useTiposVehiculo } from '@/features/tipo-vehiculo/use-tipos-vehiculo';
import { formatFechaUtc, formatMoneda, toInputDate } from '@/lib/format';
import type { Tarifa } from '@/types/models';

const estados: Record<
  EstadoTarifa,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  vigente: { label: 'Vigente', variant: 'default' },
  programada: { label: 'Programada', variant: 'secondary' },
  anterior: { label: 'Anterior', variant: 'outline' },
};

export function TarifasPage() {
  const tarifas = useTarifas();
  const tiposVehiculo = useTiposVehiculo();
  const tiposEstadia = useTiposEstadia();
  const crear = useCrearTarifa();
  const actualizar = useActualizarTarifa();
  const eliminar = useEliminarTarifa();

  const [editando, setEditando] = useState<Tarifa | 'nueva' | null>(null);
  const [aEliminar, setAEliminar] = useState<Tarifa | null>(null);

  const estadoPorId = useMemo(() => calcularEstadosTarifas(tarifas.data ?? []), [tarifas.data]);
  const opcionesListas = tiposVehiculo.data !== undefined && tiposEstadia.data !== undefined;

  return (
    <section>
      <PageHeader
        title="Tarifas"
        description="Precio por tipo de vehículo y de estadía. Solo se pueden editar o eliminar las tarifas programadas."
        actions={
          <Button onClick={() => setEditando('nueva')} disabled={!opcionesListas}>
            <Plus aria-hidden />
            Nueva tarifa
          </Button>
        }
      />

      <QueryState
        isPending={tarifas.isPending}
        error={tarifas.error}
        isEmpty={tarifas.data?.length === 0}
        emptyMessage="Todavía no hay tarifas."
        onRetry={() => tarifas.refetch()}
      >
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehículo</TableHead>
                <TableHead>Estadía</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-24 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tarifas.data?.map((tarifa) => {
                const estado = estadoPorId.get(tarifa.id) ?? 'anterior';
                const nombre = `${tarifa.tipoVehiculo.tipo} por ${tarifa.tipoEstadia.tipo}`;
                return (
                  <TableRow key={tarifa.id}>
                    <TableCell className="font-medium">{tarifa.tipoVehiculo.tipo}</TableCell>
                    <TableCell>{tarifa.tipoEstadia.tipo}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoneda(tarifa.valor)}
                    </TableCell>
                    <TableCell>{formatFechaUtc(tarifa.fechaDesde)}</TableCell>
                    <TableCell>
                      <Badge variant={estados[estado].variant}>{estados[estado].label}</Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {estado === 'programada' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Editar tarifa ${nombre}`}
                            onClick={() => setEditando(tarifa)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Eliminar tarifa ${nombre}`}
                            onClick={() => setAEliminar(tarifa)}
                          >
                            <Trash2 />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </QueryState>

      <Dialog open={editando !== null} onOpenChange={(open) => !open && setEditando(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando === 'nueva' ? 'Nueva tarifa' : 'Editar tarifa'}</DialogTitle>
            <DialogDescription>
              Para cambiar un precio vigente, creá una tarifa nueva con la fecha desde la que rige.
            </DialogDescription>
          </DialogHeader>
          {editando !== null && opcionesListas && (
            <TarifaForm
              tiposVehiculo={tiposVehiculo.data}
              tiposEstadia={tiposEstadia.data}
              defaultValues={
                editando === 'nueva'
                  ? undefined
                  : {
                      tipoVehiculoId: String(editando.tipoVehiculo.id),
                      tipoEstadiaId: String(editando.tipoEstadia.id),
                      valor: String(editando.valor),
                      fechaDesde: toInputDate(editando.fechaDesde),
                    }
              }
              isPending={crear.isPending || actualizar.isPending}
              onSubmit={(data) => {
                const cerrar = { onSuccess: () => setEditando(null) };
                if (editando === 'nueva') crear.mutate(data, cerrar);
                else actualizar.mutate({ id: editando.id, data }, cerrar);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={aEliminar !== null}
        onOpenChange={(open) => !open && setAEliminar(null)}
        title="¿Eliminar la tarifa programada?"
        description={
          aEliminar
            ? `${aEliminar.tipoVehiculo.tipo} por ${aEliminar.tipoEstadia.tipo}: ${formatMoneda(aEliminar.valor)} desde el ${formatFechaUtc(aEliminar.fechaDesde)}.`
            : ''
        }
        isPending={eliminar.isPending}
        onConfirm={() =>
          aEliminar && eliminar.mutate(aEliminar.id, { onSuccess: () => setAEliminar(null) })
        }
      />
    </section>
  );
}
