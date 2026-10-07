import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { aMinutos, desdeMinutos, UNIDADES_DURACION } from '@/lib/duracion';
import { aplicarErroresApi } from '@/lib/form-errors';
import type { TipoEstadia } from '@/types/models';
import type { TipoEstadiaInput } from './tipo-estadia.service';
import { tipoEstadiaSchema, type TipoEstadiaFormValues } from './tipo-estadia.schema';

interface TipoEstadiaFormProps {
  tipoEstadia?: TipoEstadia;
  onSubmit: (data: TipoEstadiaInput) => Promise<unknown>;
  onCancel: () => void;
}

function valoresIniciales(tipoEstadia?: TipoEstadia): TipoEstadiaFormValues {
  if (!tipoEstadia) return { tipo: '', cantidad: '', unidad: 'HORAS' };
  const { cantidad, unidad } = desdeMinutos(tipoEstadia.duracionMinutos);
  return { tipo: tipoEstadia.tipo, cantidad: String(cantidad), unidad };
}

export function TipoEstadiaForm({ tipoEstadia, onSubmit, onCancel }: TipoEstadiaFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TipoEstadiaFormValues>({
    resolver: zodResolver(tipoEstadiaSchema),
    defaultValues: valoresIniciales(tipoEstadia),
  });

  const enviar = handleSubmit(async (values) => {
    try {
      await onSubmit({
        tipo: values.tipo,
        duracionMinutos: aMinutos(Number(values.cantidad), values.unidad),
      });
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

        <Field data-invalid={!!errors.cantidad}>
          <FieldLabel htmlFor="cantidad">Duración</FieldLabel>
          <div className="flex gap-2">
            <Input
              id="cantidad"
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="1"
              className="flex-1"
              aria-invalid={!!errors.cantidad}
              {...register('cantidad')}
            />
            <Controller
              control={control}
              name="unidad"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-32" aria-label="Unidad de duración">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIDADES_DURACION.map((u) => (
                      <SelectItem key={u.value} value={u.value}>
                        {u.plural.charAt(0).toUpperCase() + u.plural.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <FieldError errors={[errors.cantidad]} />
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
