import { Ban, Car, House, Plus, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import type { CocheraAdmin } from './cochera-admin.service';
import { COLOR_ESTADO_COCHERA, ESTADO_COCHERA_LABEL } from './estado-cochera';

/** Desde el breakpoint sm de Tailwind entran 8 cocheras por fila; en celular, 4 */
const MEDIA_SM = '(min-width: 40rem)';

function suscribirAncho(onCambio: () => void) {
  const media = window.matchMedia(MEDIA_SM);
  media.addEventListener('change', onCambio);
  return () => media.removeEventListener('change', onCambio);
}

function usePorFila() {
  const pantallaGrande = useSyncExternalStore(
    suscribirAncho,
    () => window.matchMedia(MEDIA_SM).matches,
  );
  return pantallaGrande ? 8 : 4;
}

type Lugar = CocheraAdmin | 'agregar';

interface PlanoPlayaProps {
  cocheras: CocheraAdmin[];
  /** Las cocheras que no coinciden con los filtros se ven atenuadas */
  coincide: (cochera: CocheraAdmin) => boolean;
  onSeleccionar: (cochera: CocheraAdmin) => void;
  onAgregar: () => void;
}

function enFilas(lugares: Lugar[], porFila: number) {
  const filas: Lugar[][] = [];
  for (let i = 0; i < lugares.length; i += porFila) filas.push(lugares.slice(i, i + porFila));
  return filas;
}

/** Vista desde arriba de una playa: filas de cocheras enfrentadas con un carril en el medio */
export function PlanoPlaya({ cocheras, coincide, onSeleccionar, onAgregar }: PlanoPlayaProps) {
  const porFila = usePorFila();
  const ordenadas = [...cocheras].sort((a, b) => a.id - b.id);
  const filas = enFilas([...ordenadas, 'agregar'], porFila);
  // Cada bloque son dos filas que comparten carril
  const bloques: Lugar[][][] = [];
  for (let i = 0; i < filas.length; i += 2) bloques.push(filas.slice(i, i + 2));

  return (
    <div className="bg-card space-y-4 rounded-xl border p-3 sm:p-4">
      {bloques.map((bloque, i) => (
        <div key={i}>
          <Fila lugares={bloque[0]} lado="arriba" {...{ coincide, onSeleccionar, onAgregar }} />
          <div aria-hidden className="bg-muted relative my-1 flex h-10 items-center rounded-sm">
            <div className="border-muted-foreground/30 mx-3 w-full border-t-2 border-dashed" />
          </div>
          {bloque[1] && (
            <Fila lugares={bloque[1]} lado="abajo" {...{ coincide, onSeleccionar, onAgregar }} />
          )}
        </div>
      ))}
    </div>
  );
}

interface FilaProps extends Omit<PlanoPlayaProps, 'cocheras'> {
  lugares: Lugar[];
  /** De que lado del carril esta la fila (define donde va el cordon) */
  lado: 'arriba' | 'abajo';
}

function Fila({ lugares, lado, coincide, onSeleccionar, onAgregar }: FilaProps) {
  return (
    <ul
      className={cn(
        'border-muted-foreground/25 grid grid-cols-4 gap-2 sm:grid-cols-8',
        lado === 'arriba' ? 'border-t-4 pt-2' : 'border-b-4 pb-2',
      )}
    >
      {lugares.map((lugar) => (
        <li key={lugar === 'agregar' ? 'agregar' : lugar.id}>
          {lugar === 'agregar' ? (
            <button
              type="button"
              onClick={onAgregar}
              aria-label="Agregar cochera"
              className="text-muted-foreground hover:border-primary hover:text-primary focus-visible:ring-ring flex aspect-[3/4] w-full items-center justify-center rounded-md border-2 border-dashed transition-colors outline-none focus-visible:ring-2"
            >
              <Plus className="size-5" />
            </button>
          ) : (
            <EspacioCochera
              cochera={lugar}
              atenuada={!coincide(lugar)}
              onClick={() => onSeleccionar(lugar)}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

interface EspacioCocheraProps {
  cochera: CocheraAdmin;
  atenuada: boolean;
  onClick: () => void;
}

function EspacioCochera({ cochera, atenuada, onClick }: EspacioCocheraProps) {
  const IconoEstado =
    cochera.estado === 'OCUPADA' ? Car : cochera.estado === 'INHABILITADA' ? Ban : null;
  const IconoTecho = cochera.techada ? House : Sun;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Cochera ${cochera.id}, ${ESTADO_COCHERA_LABEL[cochera.estado].toLowerCase()}, ${cochera.techada ? 'techada' : 'descubierta'}. Editar`}
      className={cn(
        'focus-visible:ring-ring flex aspect-[3/4] w-full flex-col items-center justify-between rounded-md p-2 text-sm font-semibold ring-1 transition outline-none ring-inset hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2',
        COLOR_ESTADO_COCHERA[cochera.estado],
        atenuada && 'opacity-25 hover:opacity-60',
      )}
    >
      <span>#{cochera.id}</span>
      {IconoEstado ? <IconoEstado aria-hidden className="size-6" /> : <span />}
      <IconoTecho aria-hidden className="size-4 opacity-70" />
    </button>
  );
}
