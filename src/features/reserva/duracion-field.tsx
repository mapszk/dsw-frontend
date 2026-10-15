import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatDuracion } from '@/lib/duracion';
import type { TipoEstadia } from '@/types/models';

/** Estadias de hasta una hora se eligen con slider, hasta completar un dia */
const MINUTOS_DIA = 24 * 60;
const MAX_UNIDADES = 99;

interface DuracionFieldProps {
  id: string;
  tipoEstadia?: TipoEstadia;
  /** Cantidad de unidades del tipo de estadia (ej: 3 horas, 2 dias) */
  value: number;
  onChange: (cantidad: number) => void;
}

function maxUnidades(tipoEstadia: TipoEstadia) {
  return usaSlider(tipoEstadia)
    ? Math.floor(MINUTOS_DIA / tipoEstadia.duracionMinutos)
    : MAX_UNIDADES;
}

/** En el slider todo se expresa en horas (o minutos): 24 horas y no "1 día" */
function formatCorto(minutos: number) {
  if (minutos % 60 !== 0) return `${minutos} minutos`;
  const horas = minutos / 60;
  return `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
}

function usaSlider(tipoEstadia: TipoEstadia) {
  return tipoEstadia.duracionMinutos <= 60;
}

export function DuracionField({ id, tipoEstadia, value, onChange }: DuracionFieldProps) {
  if (!tipoEstadia) {
    return (
      <p
        id={id}
        className="text-muted-foreground rounded-lg border border-dashed px-3 py-2 text-sm"
      >
        Elegí el tipo de estadía para indicar la duración.
      </p>
    );
  }

  const max = maxUnidades(tipoEstadia);

  if (usaSlider(tipoEstadia)) {
    const texto = formatCorto(value * tipoEstadia.duracionMinutos);
    return (
      <div className="space-y-3">
        <p className="text-primary text-lg font-semibold" aria-live="polite">
          {texto}
        </p>
        <Slider
          id={id}
          min={1}
          max={max}
          step={1}
          value={[value]}
          onValueChange={([cantidad]) => onChange(cantidad)}
          aria-label="Duración"
          aria-valuetext={texto}
          className="py-2 [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-track]]:h-2"
        />
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>{formatCorto(tipoEstadia.duracionMinutos)}</span>
          <span>{formatCorto(max * tipoEstadia.duracionMinutos)}</span>
        </div>
      </div>
    );
  }

  const texto = formatDuracion(value * tipoEstadia.duracionMinutos);

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Menos"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus />
      </Button>
      <output
        id={id}
        aria-live="polite"
        className="text-primary min-w-24 text-center text-lg font-semibold"
      >
        {texto}
      </output>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Más"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus />
      </Button>
    </div>
  );
}
