import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { aplicarErroresApi } from '@/lib/form-errors';
import type { TipoEstadia } from '@/types/models';
import type { TipoEstadiaInput } from './tipo-estadia.service';
import { tipoEstadiaSchema, type TipoEstadiaFormValues } from './tipo-estadia.schema';

interface TipoEstadiaFormProps {
  tipoEstadia?: TipoEstadia;
  onSubmit: (data: TipoEstadiaInput) => Promise<unknown>;
  onCancel: () => void;
}

export function TipoEstadiaForm({ tipoEstadia, onSubmit, onCancel }: TipoEstadiaFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TipoEstadiaFormValues>({
    resolver: zodResolver(tipoEstadiaSchema),
    defaultValues: {
      tipo: tipoEstadia?.tipo ?? '',
      duracionMinutos: tipoEstadia ? String(tipoEstadia.duracionMinutos) : '',
    },
  });

  const enviar = handleSubmit(async (values) => {
    try {
      await onSubmit({ tipo: values.tipo, duracionMinutos: Number(values.duracionMinutos) });
    } catch (error) {
      aplicarErroresApi(error, setError);
    }
  });

  return (
    <form onSubmit={enviar} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.tipo}>
          <FieldLabel htmlFor="tipo">Nombre</FieldLabel>
          <Input id="tipo" placeholder="HORA" aria-invalid={!!errors.tipo} {...register('tipo')} />
          <FieldError errors={[errors.tipo]} />
        </Field>

        <Field data-invalid={!!errors.duracionMinutos}>
          <FieldLabel htmlFor="duracionMinutos">Duración (minutos)</FieldLabel>
          <Input
            id="duracionMinutos"
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="60"
            aria-invalid={!!errors.duracionMinutos}
            {...register('duracionMinutos')}
          />
          <FieldDescription>Ej: 60 para una hora, 1440 para un día.</FieldDescription>
          <FieldError errors={[errors.duracionMinutos]} />
        </Field>

        <FieldError errors={[errors.root]} />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
