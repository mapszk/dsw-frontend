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
import type { Playa } from '@/types/models';

interface PlayaListProps {
  playas: Playa[];
  onEdit: (playa: Playa) => void;
  onDelete: (playa: Playa) => void;
}

export function PlayaList({ playas, onEdit, onDelete }: PlayaListProps) {
  const acciones = (playa: Playa) => (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Editar ${playa.sector}`}
        onClick={() => onEdit(playa)}
      >
        <PencilIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Eliminar ${playa.sector}`}
        onClick={() => onDelete(playa)}
      >
        <Trash2Icon />
      </Button>
    </div>
  );

  return (
    <>
      {/* Celular: cards */}
      <ul className="flex flex-col gap-2 md:hidden">
        {playas.map((playa) => (
          <li key={playa.id} className="flex items-center justify-between rounded-lg border p-3">
            <p className="font-medium">{playa.sector}</p>
            {acciones(playa)}
          </li>
        ))}
      </ul>

      {/* Tablet y escritorio: tabla */}
      <div className="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sector</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playas.map((playa) => (
              <TableRow key={playa.id}>
                <TableCell className="font-medium">{playa.sector}</TableCell>
                <TableCell>{acciones(playa)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}