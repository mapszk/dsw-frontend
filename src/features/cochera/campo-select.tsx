import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CampoSelectProps {
  id: string;
  etiqueta: string;
  valor: string;
  opciones: { valor: string; texto: string }[];
  error?: string;
  onCambio: (valor: string) => void;
}

export function CampoSelect({ id, etiqueta, valor, opciones, error, onCambio }: CampoSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{etiqueta}</Label>
      <Select value={valor} onValueChange={onCambio}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Elegí una opción" />
        </SelectTrigger>
        <SelectContent>
          {opciones.map((opcion) => (
            <SelectItem key={opcion.valor} value={opcion.valor}>
              {opcion.texto}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}