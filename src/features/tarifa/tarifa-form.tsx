import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fromInputDate, toInputDate } from '@/lib/format';
import type { TipoEstadia, TipoVehiculo } from '@/types/models';
import { tarifaSchema, type TarifaPayload, type TarifaValues } from './tarifa.schema';

interface TarifaFormProps {
  tiposVehiculo: TipoVehiculo[];
  tiposEstadia: TipoEstadia[];
  defaultValues?: TarifaValues;
  isPending?: boolean;
  onSubmit: (data: TarifaPayload) => void;
}

const vacio: TarifaValues = { tipoVehiculoId: '', tipoEstadiaId: '', valor: '', fechaDesde: '' };

export function TarifaForm({
  tiposVehiculo,
  tiposEstadia,
  defaultValues = vacio,
  isPending = false,
  onSubmit,
}: TarifaFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TarifaValues>({ resolver: zodResolver(tarifaSchema), defaultValues });
  // Primer dia que se puede elegir en el calendario (se calcula una vez, al abrir el formulario)
  const [manana] = useState(() =>
    toInputDate(new Date(Date.now() + 24 * 60 * 60_000).toISOString()),
  );

  return (
    <form
      noValidate
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={handleSubmit((values) =>
        onSubmit({
          tipoVehiculoId: Number(values.tipoVehiculoId),
          tipoEstadiaId: Number(values.tipoEstadiaId),
          valor: Number(values.valor.replace(',', '.')),
          fechaDesde: fromInputDate(values.fechaDesde),
        }),
      )}
    >
      <FormField
        id="tipoVehiculoId"
        label="Tipo de vehículo"
        error={errors.tipoVehiculoId?.message}
      >
        <Controller
          control={control}
          name="tipoVehiculoId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="tipoVehiculoId"
                className="w-full"
                aria-invalid={!!errors.tipoVehiculoId}
              >
                <SelectValue placeholder="Elegí uno" />
              </SelectTrigger>
              <SelectContent>
                {tiposVehiculo.map((tipo) => (
                  <SelectItem key={tipo.id} value={String(tipo.id)}>
                    {tipo.tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField id="tipoEstadiaId" label="Tipo de estadía" error={errors.tipoEstadiaId?.message}>
        <Controller
          control={control}
          name="tipoEstadiaId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="tipoEstadiaId"
                className="w-full"
                aria-invalid={!!errors.tipoEstadiaId}
              >
                <SelectValue placeholder="Elegí uno" />
              </SelectTrigger>
              <SelectContent>
                {tiposEstadia.map((tipo) => (
                  <SelectItem key={tipo.id} value={String(tipo.id)}>
                    {tipo.tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField id="valor" label="Valor ($)" error={errors.valor?.message}>
        <Input
          id="valor"
          inputMode="decimal"
          placeholder="Ej: 1500"
          aria-invalid={!!errors.valor}
          aria-describedby={errors.valor ? 'valor-error' : undefined}
          {...register('valor')}
        />
      </FormField>

      <FormField id="fechaDesde" label="Vigente desde" error={errors.fechaDesde?.message}>
        <Input
          id="fechaDesde"
          type="date"
          min={manana}
          aria-invalid={!!errors.fechaDesde}
          aria-describedby={errors.fechaDesde ? 'fechaDesde-error' : undefined}
          {...register('fechaDesde')}
        />
      </FormField>

      <Button type="submit" disabled={isPending} className="sm:col-span-2">
        {isPending ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
}
