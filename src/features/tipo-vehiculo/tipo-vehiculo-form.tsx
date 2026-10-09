import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { tipoVehiculoSchema, type TipoVehiculoValues } from './tipo-vehiculo.schema';

interface TipoVehiculoFormProps {
  defaultValues?: TipoVehiculoValues;
  isPending?: boolean;
  onSubmit: (values: TipoVehiculoValues) => void;
}

export function TipoVehiculoForm({
  defaultValues = { tipo: '' },
  isPending = false,
  onSubmit,
}: TipoVehiculoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TipoVehiculoValues>({ resolver: zodResolver(tipoVehiculoSchema), defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
      <FormField id="tipo" label="Tipo" error={errors.tipo?.message}>
        <Input
          id="tipo"
          placeholder="Ej: AUTO"
          aria-invalid={!!errors.tipo}
          aria-describedby={errors.tipo ? 'tipo-error' : undefined}
          {...register('tipo')}
        />
      </FormField>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
}
