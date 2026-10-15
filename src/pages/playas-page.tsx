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
import { PlayaForm } from '@/features/playa/playa-form';
import { PlayaList } from '@/features/playa/playa-list';
import type { PlayaInput } from '@/features/playa/playa.service';
import {
  useActualizarPlaya,
  useCrearPlaya,
  useEliminarPlaya,
  usePlayas,
} from '@/features/playa/use-playas';
import type { Playa } from '@/types/models';

export function PlayasPage() {
  const playas = usePlayas();
  const crear = useCrearPlaya();
  const actualizar = useActualizarPlaya();
  const eliminar = useEliminarPlaya();

  // null: dialogo cerrado; 'nueva': alta; Playa: edicion
  const [editando, setEditando] = useState<Playa | 'nueva' | null>(null);
  const [aEliminar, setAEliminar] = useState<Playa | null>(null);

  const guardar = async (data: PlayaInput) => {
    if (editando === 'nueva') await crear.mutateAsync(data);
    else if (editando) await actualizar.mutateAsync({ id: editando.id, data });
    setEditando(null);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Playas</h1>
          <p className="text-muted-foreground text-sm">
            Sectores de estacionamiento. Cada playa agrupa un conjunto de cocheras.
          </p>
        </div>
        <Button onClick={() => setEditando('nueva')}>
          <PlusIcon /> Nueva playa
        </Button>
      </div>

      {playas.isPending ? (
        <ListSkeleton />
      ) : playas.isError ? (
        <ErrorMessage message={playas.error.message} onRetry={() => playas.refetch()} />
      ) : playas.data.length === 0 ? (
        <EmptyMessage>No hay playas cargadas.</EmptyMessage>
      ) : (
        <PlayaList playas={playas.data} onEdit={setEditando} onDelete={setAEliminar} />
      )}

      <Dialog open={editando !== null} onOpenChange={(open) => !open && setEditando(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando === 'nueva' ? 'Nueva playa' : 'Editar playa'}</DialogTitle>
            <DialogDescription>Indicá el sector de la playa.</DialogDescription>
          </DialogHeader>
          {editando !== null && (
            <PlayaForm
              playa={editando === 'nueva' ? undefined : editando}
              onSubmit={guardar}
              onCancel={() => setEditando(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={aEliminar !== null}
        onOpenChange={(open) => !open && setAEliminar(null)}
        title={`¿Eliminar ${aEliminar?.sector ?? ''}?`}
        description="No se puede eliminar si tiene cocheras asociadas."
        onConfirm={() => aEliminar && eliminar.mutate(aEliminar.id)}
      />
    </section>
  );
}