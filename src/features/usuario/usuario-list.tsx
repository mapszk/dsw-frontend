import { Pencil, Trash2 } from 'lucide-react';
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
import type { Usuario } from '@/types/models';

interface UsuarioListProps {
  usuarios: Usuario[];
  /** Usuario logueado: no se puede eliminar a si mismo */
  idActual?: number;
  onEditar: (usuario: Usuario) => void;
  onEliminar: (usuario: Usuario) => void;
}

function RolBadge({ usuario }: { usuario: Usuario }) {
  return (
    <Badge variant={usuario.rol === 'ADMIN' ? 'default' : 'secondary'}>
      {usuario.rol === 'ADMIN' ? 'Admin' : 'Cliente'}
    </Badge>
  );
}

function Acciones({
  usuario,
  idActual,
  onEditar,
  onEliminar,
}: Omit<UsuarioListProps, 'usuarios'> & { usuario: Usuario }) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Editar a ${usuario.nombre}`}
        onClick={() => onEditar(usuario)}
      >
        <Pencil />
      </Button>
      {usuario.id !== idActual && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Eliminar a ${usuario.nombre}`}
          onClick={() => onEliminar(usuario)}
        >
          <Trash2 />
        </Button>
      )}
    </>
  );
}

export function UsuarioList({ usuarios, ...acciones }: UsuarioListProps) {
  return (
    <>
      {/* Celular: cards */}
      <ul className="flex flex-col gap-2 md:hidden">
        {usuarios.map((usuario) => (
          <li
            key={usuario.id}
            className="flex items-start justify-between gap-3 rounded-lg border p-3"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">{usuario.nombre}</span>
                <RolBadge usuario={usuario} />
              </div>
              <p className="truncate text-sm">{usuario.email}</p>
              <p className="text-muted-foreground text-xs">
                DNI {usuario.dni}
                {usuario.telefono && ` · Tel. ${usuario.telefono}`}
              </p>
            </div>
            <div className="-mr-1 flex shrink-0">
              <Acciones usuario={usuario} {...acciones} />
            </div>
          </li>
        ))}
      </ul>

      {/* Tablet y escritorio: tabla */}
      <div className="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden lg:table-cell">Teléfono</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="w-24 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="font-medium">{usuario.nombre}</TableCell>
                <TableCell>{usuario.dni}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell className="hidden lg:table-cell">{usuario.telefono ?? '-'}</TableCell>
                <TableCell>
                  <RolBadge usuario={usuario} />
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Acciones usuario={usuario} {...acciones} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
