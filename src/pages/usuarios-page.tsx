import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { PageHeader } from '@/components/page-header';
import { EmptyMessage, ErrorMessage, ListSkeleton } from '@/components/query-states';
import { Badge } from '@/components/ui/badge';
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
import { useAuth } from '@/features/auth/use-auth';
import {
  useActualizarUsuario,
  useCrearUsuario,
  useEliminarUsuario,
  useUsuarios,
} from '@/features/usuario/use-usuarios';
import { UsuarioForm } from '@/features/usuario/usuario-form';
import type { Usuario } from '@/types/models';

export function UsuariosPage() {
  const { usuario: actual } = useAuth();
  const usuarios = useUsuarios();
  const crear = useCrearUsuario();
  const actualizar = useActualizarUsuario();
  const eliminar = useEliminarUsuario();

  const [editando, setEditando] = useState<Usuario | 'nuevo' | null>(null);
  const [aEliminar, setAEliminar] = useState<Usuario | null>(null);

  return (
    <section>
      <PageHeader
        title="Usuarios"
        description="Administradores y clientes del estacionamiento."
        actions={
          <Button onClick={() => setEditando('nuevo')}>
            <Plus aria-hidden />
            Nuevo usuario
          </Button>
        }
      />

      {usuarios.isPending ? (
        <ListSkeleton />
      ) : usuarios.isError ? (
        <ErrorMessage message={usuarios.error.message} onRetry={() => usuarios.refetch()} />
      ) : usuarios.data.length === 0 ? (
        <EmptyMessage>Todavía no hay usuarios.</EmptyMessage>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="w-24 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.data.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.nombre}</TableCell>
                  <TableCell>{usuario.dni}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.telefono ?? '-'}</TableCell>
                  <TableCell>
                    <Badge variant={usuario.rol === 'ADMIN' ? 'default' : 'secondary'}>
                      {usuario.rol === 'ADMIN' ? 'Admin' : 'Cliente'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Editar a ${usuario.nombre}`}
                      onClick={() => setEditando(usuario)}
                    >
                      <Pencil />
                    </Button>
                    {/* No se puede eliminar el usuario con el que se esta logueado */}
                    {usuario.id !== actual?.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Eliminar a ${usuario.nombre}`}
                        onClick={() => setAEliminar(usuario)}
                      >
                        <Trash2 />
                      </Button>
                    )}
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
            <DialogTitle>{editando === 'nuevo' ? 'Nuevo usuario' : 'Editar usuario'}</DialogTitle>
          </DialogHeader>
          {editando !== null && (
            <UsuarioForm
              modo={editando === 'nuevo' ? 'crear' : 'editar'}
              defaultValues={
                editando === 'nuevo'
                  ? undefined
                  : {
                      nombre: editando.nombre,
                      dni: editando.dni,
                      email: editando.email,
                      telefono: editando.telefono ?? '',
                      password: '',
                      rol: editando.rol,
                    }
              }
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
        title={`¿Eliminar a ${aEliminar?.nombre}?`}
        description="No se puede eliminar un usuario que tiene reservas."
        onConfirm={() =>
          aEliminar && eliminar.mutate(aEliminar.id, { onSuccess: () => setAEliminar(null) })
        }
      />
    </section>
  );
}
