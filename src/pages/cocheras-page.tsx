import { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CampoSelect } from '@/features/cochera/campo-select';
import {
  ESTADOS_COCHERA,
  type CocheraAdmin,
  type EstadoCochera,
  type FiltrosCocheras,
} from '@/features/cochera/cochera-admin.service';
import { CocheraForm } from '@/features/cochera/cochera-form';
import {
  useCocherasAdmin,
  useEliminarCochera,
  useGuardarCochera,
  usePlayasOpciones,
} from '@/features/cochera/use-cocheras-admin';

const TODAS = 'todas';

const VARIANTE_ESTADO: Record<EstadoCochera, 'default' | 'secondary' | 'destructive'> = {
  DISPONIBLE: 'default',
  OCUPADA: 'secondary',
  INHABILITADA: 'destructive',
};

export function CocherasPage() {
  const [filtros, setFiltros] = useState<FiltrosCocheras>({});
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState<CocheraAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<CocheraAdmin | null>(null);

  const cocheras = useCocherasAdmin(filtros);
  const playas = usePlayasOpciones();
  const guardar = useGuardarCochera();
  const eliminar = useEliminarCochera();

  const formularioAbierto = creando || editando !== null;
  const cerrarFormulario = () => {
    setCreando(false);
    setEditando(null);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Cocheras</h1>
        <Button onClick={() => setCreando(true)}>Nueva cochera</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <CampoSelect
          id="filtro-playa"
          etiqueta="Playa"
          valor={filtros.playaId ? String(filtros.playaId) : TODAS}
          opciones={[
            { valor: TODAS, texto: 'Todas' },
            ...(playas.data ?? []).map((p) => ({ valor: String(p.id), texto: p.sector })),
          ]}
          onCambio={(valor) =>
            setFiltros((previo) => ({
              ...previo,
              playaId: valor === TODAS ? undefined : Number(valor),
            }))
          }
        />
        <CampoSelect
          id="filtro-estado"
          etiqueta="Estado"
          valor={filtros.estado ?? TODAS}
          opciones={[
            { valor: TODAS, texto: 'Todos' },
            ...ESTADOS_COCHERA.map((e) => ({ valor: e, texto: e })),
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
          etiqueta="Techada"
          valor={filtros.techada === undefined ? TODAS : filtros.techada ? 'si' : 'no'}
          opciones={[
            { valor: TODAS, texto: 'Todas' },
            { valor: 'si', texto: 'Sí' },
            { valor: 'no', texto: 'No' },
          ]}
          onCambio={(valor) =>
            setFiltros((previo) => ({
              ...previo,
              techada: valor === TODAS ? undefined : valor === 'si',
            }))
          }
        />
      </div>

      {cocheras.isPending && <p className="text-muted-foreground">Cargando cocheras...</p>}

      {cocheras.isError && (
        <div className="space-y-2">
          <p className="text-destructive">{cocheras.error.message}</p>
          <Button variant="outline" onClick={() => cocheras.refetch()}>
            Reintentar
          </Button>
        </div>
      )}

      {cocheras.data?.length === 0 && <p className="text-muted-foreground">No hay cocheras</p>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cocheras.data?.map((cochera) => (
          <Card key={cochera.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Cochera #{cochera.id}</span>
                <Badge variant={VARIANTE_ESTADO[cochera.estado]}>{cochera.estado}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Playa {cochera.playa?.sector ?? cochera.playaId} ·{' '}
                {cochera.techada ? 'Techada' : 'Descubierta'}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditando(cochera)}>
                  Editar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setAEliminar(cochera)}>
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={formularioAbierto}
        onOpenChange={(abierto) => {
          if (!abierto) cerrarFormulario();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar cochera' : 'Nueva cochera'}</DialogTitle>
            <DialogDescription>Completá los datos de la cochera.</DialogDescription>
          </DialogHeader>
          <CocheraForm
            key={editando?.id ?? 'nueva'}
            inicial={editando ?? undefined}
            playas={playas.data ?? []}
            guardando={guardar.isPending}
            onCancel={cerrarFormulario}
            onSubmit={(data) =>
              guardar.mutate({ id: editando?.id, data }, { onSuccess: cerrarFormulario })
            }
          />
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