import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { aplicarErroresApi } from '@/lib/form-errors';
import { OpcionSelect, type OpcionesQuery } from './opcion-select';
import type { CrearReservaInput } from './reserva.service';
import {
  crearReservaSchema,
  normalizarPatente,
  type CrearReservaFormValues,
} from './reserva.schema';

export interface ReservaFormOpciones {
  usuarios: OpcionesQuery;
  cocheras: OpcionesQuery;
  tiposVehiculo: OpcionesQuery;
  tiposEstadia: OpcionesQuery;
}

interface ReservaFormProps {
  opciones: ReservaFormOpciones;
  onSubmit: (data: CrearReservaInput) => Promise<unknown>;
  onCancel: () => void;
}

const selects = [
  { name: 'usuarioId', label: 'Cliente', placeholder: 'Seleccioná un cliente', opcion: 'usuarios' },
  {
    name: 'cocheraId',
    label: 'Cochera',
    placeholder: 'Seleccioná una cochera',
    opcion: 'cocheras',
  },
  {
    name: 'tipoVehiculoId',
    label: 'Tipo de vehículo',
    placeholder: 'Seleccioná un tipo',
    opcion: 'tiposVehiculo',
  },
  {
    name: 'tipoEstadiaId',
    label: 'Tipo de estadía',
    placeholder: 'Seleccioná un tipo',
    opcion: 'tiposEstadia',
  },
] as const;

/** Fecha en el formato de <input type="datetime-local">: 2026-10-07T18:30 (hora local) */
function toDatetimeLocal(fecha: Date) {
  const local = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function ReservaForm({ opciones, onSubmit, onCancel }: ReservaFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CrearReservaFormValues>({
    resolver: zodResolver(crearReservaSchema),
    defaultValues: {
      patente: '',
      fechaInicio: '',
      fechaFin: '',
      usuarioId: '',
      cocheraId: '',
      tipoVehiculoId: '',
      tipoEstadiaId: '',
    },
  });

  const enviar = handleSubmit(async (values) => {
    try {
      await onSubmit({
        patente: normalizarPatente(values.patente),
        fechaInicio: new Date(values.fechaInicio).toISOString(),
        fechaFin: new Date(values.fechaFin).toISOString(),
        usuarioId: Number(values.usuarioId),
        cocheraId: Number(values.cocheraId),
        tipoVehiculoId: Number(values.tipoVehiculoId),
        tipoEstadiaId: Number(values.tipoEstadiaId),
      });
    } catch (error) {
      aplicarErroresApi(error, setError);
    }
  });

  const fechaInicio = useWatch({ control, name: 'fechaInicio' });
  const ahora = toDatetimeLocal(new Date());

  return (
    <form onSubmit={enviar} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.patente}>
          <FieldLabel htmlFor="patente">Patente</FieldLabel>
          <Input
            id="patente"
            placeholder="AB123CD"
            autoCapitalize="characters"
            aria-invalid={!!errors.patente}
            {...register('patente')}
          />
          <FieldError errors={[errors.patente]} />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field data-invalid={!!errors.fechaInicio}>
            <FieldLabel htmlFor="fechaInicio">Inicio</FieldLabel>
            <Input
              id="fechaInicio"
              type="datetime-local"
              min={ahora}
              aria-invalid={!!errors.fechaInicio}
              {...register('fechaInicio')}
            />
            <FieldError errors={[errors.fechaInicio]} />
          </Field>

          <Field data-invalid={!!errors.fechaFin}>
            <FieldLabel htmlFor="fechaFin">Fin</FieldLabel>
            <Input
              id="fechaFin"
              type="datetime-local"
              min={fechaInicio || ahora}
              aria-invalid={!!errors.fechaFin}
              {...register('fechaFin')}
            />
            <FieldError errors={[errors.fechaFin]} />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {selects.map((select) => (
            <Field key={select.name} data-invalid={!!errors[select.name]}>
              <FieldLabel htmlFor={select.name}>{select.label}</FieldLabel>
              <Controller
                control={control}
                name={select.name}
                render={({ field }) => (
                  <OpcionSelect
                    id={select.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={select.placeholder}
                    opciones={opciones[select.opcion]}
                    invalid={!!errors[select.name]}
                  />
                )}
              />
              <FieldError errors={[errors[select.name]]} />
            </Field>
          ))}
        </div>

        <FieldDescription>
          El precio se calcula al confirmar, con la tarifa vigente para el tipo de vehículo y de
          estadía. Se cobra por bloques completos de la estadía elegida.
        </FieldDescription>

        <FieldError errors={[errors.root]} />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Crear reserva'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
