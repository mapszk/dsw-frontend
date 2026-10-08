import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { aplicarErroresApi } from '@/lib/form-errors';
import type { Reserva } from '@/types/models';
import type { ActualizarReservaInput } from './reserva.service';
import {
  editarReservaSchema,
  normalizarPatente,
  type EditarReservaFormValues,
} from './reserva.schema';

interface EditarReservaFormProps {
  reserva: Reserva;
  onSubmit: (data: ActualizarReservaInput) => Promise<unknown>;
  onCancel: () => void;
}

export function EditarReservaForm({ reserva, onSubmit, onCancel }: EditarReservaFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EditarReservaFormValues>({
    resolver: zodResolver(editarReservaSchema),
    defaultValues: { patente: reserva.patente },
  });

  const enviar = handleSubmit(async (values) => {
    try {
      await onSubmit({ patente: normalizarPatente(values.patente) });
    } catch (error) {
      aplicarErroresApi(error, setError);
    }
  });

  return (
    <form onSubmit={enviar} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.patente}>
          <FieldLabel htmlFor="patente">Patente</FieldLabel>
          <Input id="patente" aria-invalid={!!errors.patente} {...register('patente')} />
          <FieldDescription>
            Fechas, cochera y tipos no se editan acá: cambian el precio y la disponibilidad.
          </FieldDescription>
          <FieldError errors={[errors.patente]} />
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
