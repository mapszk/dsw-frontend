import { PencilIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDuracion } from '@/lib/duracion';
import type { TipoEstadia } from '@/types/models';

interface TipoEstadiaListProps {
  tiposEstadia: TipoEstadia[];
  onEdit: (tipoEstadia: TipoEstadia) => void;
  onDelete: (tipoEstadia: TipoEstadia) => void;
}

export function TipoEstadiaList({ tiposEstadia, onEdit, onDelete }: TipoEstadiaListProps) {
  const acciones = (tipoEstadia: TipoEstadia) => (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Editar ${tipoEstadia.tipo}`}
        onClick={() => onEdit(tipoEstadia)}
      >
        <PencilIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Eliminar ${tipoEstadia.tipo}`}
        onClick={() => onDelete(tipoEstadia)}
      >
        <Trash2Icon />
      </Button>
    </div>
  );

  return (
    <>
      {/* Celular: cards */}
      <ul className="flex flex-col gap-2 md:hidden">
        {tiposEstadia.map((tipoEstadia) => (
          <li
            key={tipoEstadia.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <p className="font-medium">{tipoEstadia.tipo}</p>
              <p className="text-muted-foreground text-sm">
                {formatDuracion(tipoEstadia.duracionMinutos)}
              </p>
            </div>
            {acciones(tipoEstadia)}
          </li>
        ))}
      </ul>

      {/* Tablet y escritorio: tabla */}
      <div className="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead className="text-right">Minutos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiposEstadia.map((tipoEstadia) => (
              <TableRow key={tipoEstadia.id}>
                <TableCell className="font-medium">{tipoEstadia.tipo}</TableCell>
                <TableCell>{formatDuracion(tipoEstadia.duracionMinutos)}</TableCell>
                <TableCell className="text-right">{tipoEstadia.duracionMinutos}</TableCell>
                <TableCell>{acciones(tipoEstadia)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
