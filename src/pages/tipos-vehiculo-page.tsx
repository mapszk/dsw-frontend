import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { PageHeader } from '@/components/page-header';
import { EmptyMessage, ErrorMessage, ListSkeleton } from '@/components/query-states';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TipoVehiculoForm } from '@/features/tipo-vehiculo/tipo-vehiculo-form';
import {
  useActualizarTipoVehiculo,
  useCrearTipoVehiculo,
  useEliminarTipoVehiculo,
  useTiposVehiculo,
} from '@/features/tipo-vehiculo/use-tipos-vehiculo';
import type { TipoVehiculo } from '@/types/models';

export function TiposVehiculoPage() {
  const tipos = useTiposVehiculo();
  const crear = useCrearTipoVehiculo();
  const actualizar = useActualizarTipoVehiculo();
  const eliminar = useEliminarTipoVehiculo();

  // null: cerrado; 'nuevo': alta; un tipo: edicion
  const [editando, setEditando] = useState<TipoVehiculo | 'nuevo' | null>(null);
  const [aEliminar, setAEliminar] = useState<TipoVehiculo | null>(null);

  return (
    <section>
      <PageHeader
        title="Tipos de vehículo"
        description="Los tipos de vehículo se usan en las tarifas y en las reservas."
        actions={
          <Button onClick={() => setEditando('nuevo')}>
            <Plus aria-hidden />
            Nuevo tipo
          </Button>
        }
      />

      {tipos.isPending ? (
        <ListSkeleton />
      ) : tipos.isError ? (
        <ErrorMessage message={tipos.error.message} onRetry={() => tipos.refetch()} />
      ) : tipos.data.length === 0 ? (
        <EmptyMessage>Todavía no hay tipos de vehículo.</EmptyMessage>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead className="w-24 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tipos.data.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.tipo}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Editar ${tipo.tipo}`}
                      onClick={() => setEditando(tipo)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Eliminar ${tipo.tipo}`}
                      onClick={() => setAEliminar(tipo)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={editando !== null} onOpenChange={(open) => !open && setEditando(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editando === 'nuevo' ? 'Nuevo tipo de vehículo' : 'Editar tipo de vehículo'}
            </DialogTitle>
          </DialogHeader>
          {editando !== null && (
            <TipoVehiculoForm
              defaultValues={editando === 'nuevo' ? undefined : { tipo: editando.tipo }}
              isPending={crear.isPending || actualizar.isPending}
              onSubmit={(data) => {
                const cerrar = { onSuccess: () => setEditando(null) };
                if (editando === 'nuevo') crear.mutate(data, cerrar);
                else actualizar.mutate({ id: editando.id, data }, cerrar);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={aEliminar !== null}
        onOpenChange={(open) => !open && setAEliminar(null)}
        title={`¿Eliminar ${aEliminar?.tipo}?`}
        description="No se puede eliminar si tiene tarifas o reservas asociadas."
        onConfirm={() =>
          aEliminar && eliminar.mutate(aEliminar.id, { onSuccess: () => setAEliminar(null) })
        }
      />
    </section>
  );
}
