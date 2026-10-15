import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { cocheraFormSchema, type CocheraFormValues } from './cochera-admin.schema';
import {
  ESTADOS_COCHERA,
  type CocheraAdmin,
  type CocheraInput,
  type PlayaOpcion,
} from './cochera-admin.service';
import { CampoSelect } from './campo-select';
import { SITUACION_COCHERA_LABEL } from './estado-cochera';

interface CocheraFormProps {
  inicial?: CocheraAdmin;
  /** Playa preseleccionada al crear una cochera nueva */
  playaIdInicial?: number;
  playas: PlayaOpcion[];
  guardando: boolean;
  onSubmit: (data: CocheraInput) => void;
  onCancel: () => void;
}

export function CocheraForm({
  inicial,
  playaIdInicial,
  playas,
  guardando,
  onSubmit,
  onCancel,
}: CocheraFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CocheraFormValues>({
    resolver: zodResolver(cocheraFormSchema),
    defaultValues: {
      techada: inicial?.techada ? 'si' : 'no',
      estado: inicial?.estado ?? 'DISPONIBLE',
      playaId: String(inicial?.playaId ?? playaIdInicial ?? ''),
    },
  });

  const enviar = handleSubmit((valores) =>
    onSubmit({
      techada: valores.techada === 'si',
      estado: valores.estado,
      playaId: Number(valores.playaId),
    }),
  );

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <Controller
        control={control}
        name="playaId"
        render={({ field }) => (
          <CampoSelect
            id="cochera-playa"
            etiqueta="Playa"
            valor={field.value}
            opciones={playas.map((p) => ({ valor: String(p.id), texto: `Playa ${p.sector}` }))}
            error={errors.playaId?.message}
            onCambio={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="techada"
        render={({ field }) => (
          <CampoSelect
            id="cochera-techada"
            etiqueta="¿Es techada?"
            valor={field.value}
            opciones={[
              { valor: 'si', texto: 'Sí' },
              { valor: 'no', texto: 'No' },
            ]}
            error={errors.techada?.message}
            onCambio={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="estado"
        render={({ field }) => (
          <CampoSelect
            id="cochera-estado"
            etiqueta="Estado"
            valor={field.value}
            opciones={ESTADOS_COCHERA.map((e) => ({ valor: e, texto: SITUACION_COCHERA_LABEL[e] }))}
            error={errors.estado?.message}
            onCambio={field.onChange}
          />
        )}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
