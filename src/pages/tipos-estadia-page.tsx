import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyMessage, ErrorMessage, ListSkeleton } from '@/components/query-states';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TipoEstadiaForm } from '@/features/tipo-estadia/tipo-estadia-form';
import { TipoEstadiaList } from '@/features/tipo-estadia/tipo-estadia-list';
import type { TipoEstadiaInput } from '@/features/tipo-estadia/tipo-estadia.service';
import {
  useActualizarTipoEstadia,
  useCrearTipoEstadia,
  useEliminarTipoEstadia,
  useTiposEstadia,
} from '@/features/tipo-estadia/use-tipos-estadia';
import type { TipoEstadia } from '@/types/models';

export function TiposEstadiaPage() {
  const tiposEstadia = useTiposEstadia();
  const crear = useCrearTipoEstadia();
  const actualizar = useActualizarTipoEstadia();
  const eliminar = useEliminarTipoEstadia();

  // null: dialogo cerrado; 'nuevo': alta; TipoEstadia: edicion
  const [editando, setEditando] = useState<TipoEstadia | 'nuevo' | null>(null);
  const [aEliminar, setAEliminar] = useState<TipoEstadia | null>(null);

  const guardar = async (data: TipoEstadiaInput) => {
    if (editando === 'nuevo') await crear.mutateAsync(data);
    else if (editando) await actualizar.mutateAsync({ id: editando.id, data });
    setEditando(null);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Tipos de estadía</h1>
          <p className="text-muted-foreground text-sm">
            Duración de cada modalidad. El precio de una reserva se calcula por bloques de esta
            duración.
          </p>
        </div>
        <Button onClick={() => setEditando('nuevo')}>
          <PlusIcon /> Nuevo tipo
        </Button>
      </div>

      {tiposEstadia.isPending ? (
        <ListSkeleton />
      ) : tiposEstadia.isError ? (
        <ErrorMessage message={tiposEstadia.error.message} onRetry={() => tiposEstadia.refetch()} />
      ) : tiposEstadia.data.length === 0 ? (
        <EmptyMessage>No hay tipos de estadía cargados.</EmptyMessage>
      ) : (
        <TipoEstadiaList
          tiposEstadia={tiposEstadia.data}
          onEdit={setEditando}
          onDelete={setAEliminar}
        />
      )}

      <Dialog open={editando !== null} onOpenChange={(open) => !open && setEditando(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editando === 'nuevo' ? 'Nuevo tipo de estadía' : 'Editar tipo de estadía'}
            </DialogTitle>
            <DialogDescription>El nombre se guarda en mayúsculas.</DialogDescription>
          </DialogHeader>
          {editando !== null && (
            <TipoEstadiaForm
              tipoEstadia={editando === 'nuevo' ? undefined : editando}
              onSubmit={guardar}
              onCancel={() => setEditando(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={aEliminar !== null}
        onOpenChange={(open) => !open && setAEliminar(null)}
        title={`¿Eliminar ${aEliminar?.tipo ?? ''}?`}
        description="No se puede eliminar si tiene tarifas o reservas asociadas."
        onConfirm={() => aEliminar && eliminar.mutate(aEliminar.id)}
      />
    </section>
  );
}
