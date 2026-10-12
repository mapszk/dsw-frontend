import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { aplicarErroresApi } from '@/lib/form-errors';
import type { Playa } from '@/types/models';
import { playaSchema, type PlayaFormValues } from './playa.schema';

interface PlayaFormProps {
  playa?: Playa;
  onSubmit: (data: PlayaFormValues) => Promise<unknown>;
  onCancel: () => void;
}

export function PlayaForm({ playa, onSubmit, onCancel }: PlayaFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PlayaFormValues>({
    resolver: zodResolver(playaSchema),
    defaultValues: { sector: playa?.sector ?? '' },
  });

  const enviar = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      aplicarErroresApi(error, setError);
    }
  });

  return (
    <form onSubmit={enviar} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.sector}>
          <FieldLabel htmlFor="sector">Sector</FieldLabel>
          <Input
            id="sector"
            placeholder="Norte"
            aria-invalid={!!errors.sector}
            {...register('sector')}
          />
          <FieldError errors={[errors.sector]} />
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