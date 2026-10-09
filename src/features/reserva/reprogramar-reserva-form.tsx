import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toInputDateTime } from '@/lib/format';
import type { ReprogramarReservaPayload } from './reserva.service';
import {
  reprogramarReservaSchema,
  type ReprogramarReservaValues,
} from './reprogramar-reserva.schema';

interface ReprogramarReservaFormProps {
  fechaInicio: string;
  fechaFin: string;
  isPending?: boolean;
  onSubmit: (data: ReprogramarReservaPayload) => void;
}

export function ReprogramarReservaForm({
  fechaInicio,
  fechaFin,
  isPending = false,
  onSubmit,
}: ReprogramarReservaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReprogramarReservaValues>({
    resolver: zodResolver(reprogramarReservaSchema),
    defaultValues: {
      fechaInicio: toInputDateTime(fechaInicio),
      fechaFin: toInputDateTime(fechaFin),
    },
  });

  return (
    <form
      noValidate
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={handleSubmit((values) =>
        onSubmit({
          fechaInicio: new Date(values.fechaInicio).toISOString(),
          fechaFin: new Date(values.fechaFin).toISOString(),
        }),
      )}
    >
      <FormField id="fechaInicio" label="Nuevo inicio" error={errors.fechaInicio?.message}>
        <Input
          id="fechaInicio"
          type="datetime-local"
          aria-invalid={!!errors.fechaInicio}
          aria-describedby={errors.fechaInicio ? 'fechaInicio-error' : undefined}
          {...register('fechaInicio')}
        />
      </FormField>
      <FormField id="fechaFin" label="Nuevo fin" error={errors.fechaFin?.message}>
        <Input
          id="fechaFin"
          type="datetime-local"
          aria-invalid={!!errors.fechaFin}
          aria-describedby={errors.fechaFin ? 'fechaFin-error' : undefined}
          {...register('fechaFin')}
        />
      </FormField>
      <Button type="submit" disabled={isPending} className="sm:col-span-2">
        {isPending ? 'Reprogramando...' : 'Reprogramar'}
      </Button>
    </form>
  );
}
