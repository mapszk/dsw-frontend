import { PlusIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EmptyMessage, ErrorMessage, ListSkeleton } from '@/components/query-states';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CampoSelect } from '@/features/cochera/campo-select';
import {
  ESTADOS_COCHERA,
  type CocheraAdmin,
  type EstadoCochera,
  type FiltrosCocheras,
} from '@/features/cochera/cochera-admin.service';
import { CocheraForm } from '@/features/cochera/cochera-form';
import { COLOR_ESTADO_COCHERA, ESTADO_COCHERA_LABEL } from '@/features/cochera/estado-cochera';
import { PlanoPlaya } from '@/features/cochera/plano-playa';
import {
  useCocherasAdmin,
  useEliminarCochera,
  useGuardarCochera,
  usePlayasOpciones,
} from '@/features/cochera/use-cocheras-admin';
import { cn } from '@/lib/utils';

const TODAS = 'todas';
const SIN_FILTROS: FiltrosCocheras = {};

type Filtros = Omit<FiltrosCocheras, 'playaId'>;

function coincideCon(filtros: Filtros) {
  return (cochera: CocheraAdmin) =>
    (!filtros.estado || cochera.estado === filtros.estado) &&
    (filtros.techada === undefined || cochera.techada === filtros.techada);
}

export function CocherasPage() {
  const [playaElegida, setPlayaElegida] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<Filtros>({});
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState<CocheraAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<CocheraAdmin | null>(null);

  // Se traen todas una sola vez: cambiar de playa o de filtro no vuelve a pedir datos
  const cocheras = useCocherasAdmin(SIN_FILTROS);
  const playas = usePlayasOpciones();
  const guardar = useGuardarCochera();
  const eliminar = useEliminarCochera();

  const listaPlayas = playas.data ?? [];
  const todas = cocheras.data ?? [];
  const playaActiva = playaElegida ?? String(listaPlayas[0]?.id ?? '');
  const deLaPlaya = todas.filter((c) => String(c.playaId) === playaActiva);
  const coincide = coincideCon(filtros);
  const hayFiltros = filtros.estado !== undefined || filtros.techada !== undefined;

  const formularioAbierto = creando || editando !== null;
  const cerrarFormulario = () => {
    setCreando(false);
    setEditando(null);
  };

  const cargando = cocheras.isPending || playas.isPending;
  const error = cocheras.error ?? playas.error;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Cocheras</h1>
          <p className="text-muted-foreground text-sm">
            Elegí una playa y tocá una cochera para editarla.
          </p>
        </div>
        <Button onClick={() => setCreando(true)} disabled={!playaActiva}>
          <PlusIcon /> Nueva cochera
        </Button>
      </div>

      {cargando ? (
        <ListSkeleton />
      ) : error ? (
        <ErrorMessage
          message={error.message}
          onRetry={() => {
            void cocheras.refetch();
            void playas.refetch();
          }}
        />
      ) : listaPlayas.length === 0 ? (
        <EmptyMessage>No hay playas. Creá una desde la sección Playas.</EmptyMessage>
      ) : (
        <>
          <Tabs value={playaActiva} onValueChange={setPlayaElegida}>
            <div className="-mx-4 overflow-x-auto overflow-y-hidden px-4 py-0.5 sm:mx-0 sm:px-0">
              <TabsList>
                {listaPlayas.map((playa) => (
                  <TabsTrigger key={playa.id} value={String(playa.id)} className="px-3">
                    Playa {playa.sector}
                    <span className="text-muted-foreground text-xs font-normal">
                      {todas.filter((c) => c.playaId === playa.id).length}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>

          <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
            <aside className="space-y-4 lg:order-last">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                <CampoSelect
                  id="filtro-estado"
                  etiqueta="Estado"
                  valor={filtros.estado ?? TODAS}
                  opciones={[
                    { valor: TODAS, texto: 'Todos' },
                    ...ESTADOS_COCHERA.map((e) => ({ valor: e, texto: ESTADO_COCHERA_LABEL[e] })),
                  ]}
                  onCambio={(valor) =>
                    setFiltros((previo) => ({
                      ...previo,
                      estado: valor === TODAS ? undefined : (valor as EstadoCochera),
                    }))
                  }
                />
                <CampoSelect
                  id="filtro-techada"
                  etiqueta="Techo"
                  valor={filtros.techada === undefined ? TODAS : filtros.techada ? 'si' : 'no'}
                  opciones={[
                    { valor: TODAS, texto: 'Todas' },
                    { valor: 'si', texto: 'Techadas' },
                    { valor: 'no', texto: 'Descubiertas' },
                  ]}
                  onCambio={(valor) =>
                    setFiltros((previo) => ({
                      ...previo,
                      techada: valor === TODAS ? undefined : valor === 'si',
                    }))
                  }
                />
              </div>

              <ul
                className="flex flex-wrap gap-x-4 gap-y-2 text-sm lg:flex-col"
                aria-label="Resumen"
              >
                {ESTADOS_COCHERA.map((estado) => (
                  <li key={estado} className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={cn(
                        'size-3.5 rounded-sm ring-1 ring-inset',
                        COLOR_ESTADO_COCHERA[estado],
                      )}
                    />
                    {ESTADO_COCHERA_LABEL[estado]}
                    <span className="text-muted-foreground">
                      {deLaPlaya.filter((c) => c.estado === estado).length}
                    </span>
                  </li>
                ))}
              </ul>

              {hayFiltros && (
                <div className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
                  <span>
                    {deLaPlaya.filter(coincide).length} de {deLaPlaya.length} coinciden
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setFiltros({})}>
                    Limpiar
                  </Button>
                </div>
              )}
            </aside>

            <div className="space-y-3">
              <PlanoPlaya
                cocheras={deLaPlaya}
                coincide={coincide}
                onSeleccionar={setEditando}
                onAgregar={() => setCreando(true)}
              />
              {deLaPlaya.length === 0 && (
                <p className="text-muted-foreground text-center text-sm">
                  Esta playa todavía no tiene cocheras. Agregá la primera con el botón +.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      <Dialog
        open={formularioAbierto}
        onOpenChange={(abierto) => {
          if (!abierto) cerrarFormulario();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editando ? `Cochera #${editando.id}` : 'Nueva cochera'}
              {editando && (
                <Badge className={cn('border-transparent', COLOR_ESTADO_COCHERA[editando.estado])}>
                  {ESTADO_COCHERA_LABEL[editando.estado]}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {editando ? 'Modificá los datos de la cochera.' : 'Completá los datos de la cochera.'}
            </DialogDescription>
          </DialogHeader>
          <CocheraForm
            key={editando?.id ?? 'nueva'}
            inicial={editando ?? undefined}
            playaIdInicial={playaActiva ? Number(playaActiva) : undefined}
            playas={listaPlayas}
            guardando={guardar.isPending}
            onCancel={cerrarFormulario}
            onSubmit={(data) =>
              guardar.mutate({ id: editando?.id, data }, { onSuccess: cerrarFormulario })
            }
          />
          {editando && (
            <>
              <Separator />
              <Button
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive justify-start"
                onClick={() => {
                  setAEliminar(editando);
                  cerrarFormulario();
                }}
              >
                <Trash2 aria-hidden /> Eliminar cochera
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={aEliminar !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setAEliminar(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar la cochera #{aEliminar?.id}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Si la cochera tiene reservas, no se va a poder
              eliminar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (aEliminar) eliminar.mutate(aEliminar.id);
                setAEliminar(null);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
