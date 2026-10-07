import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface Opcion {
  value: string;
  label: string;
}

export interface OpcionesQuery {
  options: Opcion[];
  isPending: boolean;
  isError: boolean;
}

interface OpcionSelectProps {
  id: string;
  value: string;
  placeholder: string;
  opciones: OpcionesQuery;
  invalid?: boolean;
  onChange: (value: string) => void;
}

/**
 * Select de una entidad relacionada. Si el listado no se pudo cargar (por ejemplo, el endpoint
 * todavia no existe) permite cargar el ID a mano para no bloquear el formulario.
 */
export function OpcionSelect({
  id,
  value,
  placeholder,
  opciones,
  invalid,
  onChange,
}: OpcionSelectProps) {
  if (opciones.isError) {
    return (
      <div className="flex flex-col gap-1">
        <Input
          id={id}
          type="number"
          inputMode="numeric"
          min={1}
          placeholder="ID"
          value={value}
          aria-invalid={invalid}
          onChange={(event) => onChange(event.target.value)}
        />
        <p className="text-muted-foreground text-xs">
          No se pudo cargar el listado: ingresá el ID.
        </p>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={opciones.isPending}>
      <SelectTrigger id={id} className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder={opciones.isPending ? 'Cargando...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {opciones.options.map((opcion) => (
          <SelectItem key={opcion.value} value={opcion.value}>
            {opcion.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
