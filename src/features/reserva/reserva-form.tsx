import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { aplicarErroresApi } from '@/lib/form-errors';
import { formatFechaHora, formatMoneda } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Tarifa, TipoEstadia } from '@/types/models';
import { DuracionField } from './duracion-field';
import { buscarTarifaVigente, calcularFin, estimarPrecio } from './estimacion';
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
  /** Para calcular el fin y el precio estimado */
  tiposEstadia: TipoEstadia[];
  tarifas: Tarifa[];
  /** true para un ADMIN, que elige el cliente; un CLIENTE reserva a su nombre */
  elegirCliente?: boolean;
  onSubmit: (data: CrearReservaInput) => Promise<unknown>;
  onCancel: () => void;
}

const selects = {
  usuarioId: { label: 'Cliente', placeholder: 'Seleccioná un cliente', opcion: 'usuarios' },
  cocheraId: { label: 'Cochera', placeholder: 'Seleccioná una cochera', opcion: 'cocheras' },
  tipoVehiculoId: {
    label: 'Tipo de vehículo',
    placeholder: 'Seleccioná un tipo',
    opcion: 'tiposVehiculo',
  },
  tipoEstadiaId: {
    label: 'Tipo de estadía',
    placeholder: 'Seleccioná un tipo',
    opcion: 'tiposEstadia',
  },
} as const;

interface SeccionProps {
  numero: number;
  titulo: string;
  descripcion: string;
  children: ReactNode;
}

/** Bloque numerado del formulario */
function Seccion({ numero, titulo, descripcion, children }: SeccionProps) {
  return (
    <FieldSet>
      <FieldLegend className="mb-0 flex items-center gap-3">
        <span
          aria-hidden
          className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
        >
          {numero}
        </span>
        {titulo}
      </FieldLegend>
      <FieldDescription className="-mt-2 pl-10">{descripcion}</FieldDescription>
      <div className="sm:pl-10">{children}</div>
    </FieldSet>
  );
}

/** Proximo cuarto de hora con al menos 5 minutos de margen: 10:07 -> 10:15, 10:12 -> 10:30 */
function proximoCuarto(desde = new Date()) {
  const fecha = new Date(desde.getTime() + 5 * 60_000);
  fecha.setSeconds(0, 0);
  fecha.setMinutes(Math.ceil(fecha.getMinutes() / 15) * 15);
  return fecha;
}

function manianaALas(hora: number) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);
  fecha.setHours(hora, 0, 0, 0);
  return fecha;
}

/** Fecha en el formato de <input type="datetime-local">: 2026-10-07T18:30 (hora local) */
function toDatetimeLocal(fecha: Date) {
  const local = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function ReservaForm({
  opciones,
  tiposEstadia,
  tarifas,
  elegirCliente = true,
  onSubmit,
  onCancel,
}: ReservaFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CrearReservaFormValues>({
    resolver: zodResolver(crearReservaSchema({ elegirCliente })),
    defaultValues: {
      patente: '',
      fechaInicio: '',
      cantidad: 1,
      usuarioId: '',
      cocheraId: '',
      tipoVehiculoId: '',
      tipoEstadiaId: '',
    },
  });

  const tipoEstadiaDe = (id: string) => tiposEstadia.find((t) => String(t.id) === id);

  const enviar = handleSubmit(async (values) => {
    const tipoEstadia = tipoEstadiaDe(values.tipoEstadiaId);
    if (!tipoEstadia) return;
    const inicio = new Date(values.fechaInicio);
    try {
      await onSubmit({
        patente: normalizarPatente(values.patente),
        fechaInicio: inicio.toISOString(),
        fechaFin: calcularFin(inicio, values.cantidad, tipoEstadia.duracionMinutos).toISOString(),
        ...(elegirCliente && { usuarioId: Number(values.usuarioId) }),
        cocheraId: Number(values.cocheraId),
        tipoVehiculoId: Number(values.tipoVehiculoId),
        tipoEstadiaId: Number(values.tipoEstadiaId),
      });
    } catch (error) {
      aplicarErroresApi(error, setError);
    }
  });

  const [fechaInicio, cantidad, tipoEstadiaId, tipoVehiculoId] = useWatch({
    control,
    name: ['fechaInicio', 'cantidad', 'tipoEstadiaId', 'tipoVehiculoId'],
  });
  const ahora = toDatetimeLocal(new Date());
  const tipoEstadia = tipoEstadiaDe(tipoEstadiaId);
  const inicio = fechaInicio ? new Date(fechaInicio) : undefined;
  const inicioValido = inicio && !Number.isNaN(inicio.getTime()) ? inicio : undefined;
  const fin =
    inicioValido && tipoEstadia
      ? calcularFin(inicioValido, cantidad, tipoEstadia.duracionMinutos)
      : undefined;
  const tarifa =
    inicioValido && tipoEstadia && tipoVehiculoId
      ? buscarTarifaVigente(tarifas, Number(tipoVehiculoId), tipoEstadia.id, inicioValido)
      : undefined;

  const elegirInicio = (fecha: Date) =>
    setValue('fechaInicio', toDatetimeLocal(fecha), { shouldValidate: true });

  /** ocultarLabel: cuando el titulo de la seccion ya dice lo mismo (queda para lectores de pantalla) */
  const campoSelect = (name: keyof typeof selects, ocultarLabel = false) => {
    const select = selects[name];
    return (
      <Field data-invalid={!!errors[name]}>
        <FieldLabel htmlFor={name} className={cn(ocultarLabel && 'sr-only')}>
          {select.label}
        </FieldLabel>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <OpcionSelect
              id={name}
              value={field.value}
              onChange={(valor) => {
                field.onChange(valor);
                // Cada tipo de estadia tiene su propia escala de duracion
                if (name === 'tipoEstadiaId') setValue('cantidad', 1);
              }}
              placeholder={select.placeholder}
              opciones={opciones[select.opcion]}
              invalid={!!errors[name]}
            />
          )}
        />
        <FieldError errors={[errors[name]]} />
      </Field>
    );
  };

  return (
    <form onSubmit={enviar} noValidate>
      <FieldGroup>
        <Seccion
          numero={1}
          titulo="Datos"
          descripcion={
            elegirCliente
              ? 'El vehículo y el cliente a nombre de quien queda la reserva.'
              : 'El vehículo que vas a estacionar.'
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
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
            {elegirCliente && campoSelect('usuarioId')}
            {campoSelect('tipoVehiculoId')}
          </div>
        </Seccion>

        <FieldSeparator />

        <Seccion
          numero={2}
          titulo="Tipo de estadía"
          descripcion="Se cobra por bloques completos de la estadía elegida."
        >
          <div className="grid gap-4 md:grid-cols-2">{campoSelect('tipoEstadiaId', true)}</div>
        </Seccion>

        <FieldSeparator />

        <Seccion
          numero={3}
          titulo="Fecha y cochera"
          descripcion="Se valida que la cochera esté libre en ese horario."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field data-invalid={!!errors.fechaInicio}>
              <FieldLabel htmlFor="fechaInicio">¿Cuándo llegás?</FieldLabel>
              <Input
                id="fechaInicio"
                type="datetime-local"
                min={ahora}
                aria-invalid={!!errors.fechaInicio}
                {...register('fechaInicio')}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => elegirInicio(proximoCuarto())}
                >
                  Lo antes posible
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => elegirInicio(manianaALas(9))}
                >
                  Mañana 9:00
                </Button>
              </div>
              <FieldError errors={[errors.fechaInicio]} />
            </Field>

            <Field data-invalid={!!errors.cantidad}>
              <FieldLabel htmlFor="duracion">¿Por cuánto tiempo?</FieldLabel>
              <Controller
                control={control}
                name="cantidad"
                render={({ field }) => (
                  <DuracionField
                    id="duracion"
                    tipoEstadia={tipoEstadia}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {fin && (
                <FieldDescription>
                  Retirás el vehículo antes del {formatFechaHora(fin.toISOString())}
                </FieldDescription>
              )}
              <FieldError errors={[errors.cantidad]} />
            </Field>

            <div className="md:col-span-2">{campoSelect('cocheraId')}</div>
          </div>
        </Seccion>

        <FieldSeparator />

        <ResumenPrecio
          tarifa={tarifa}
          cantidad={cantidad}
          completo={!!(inicioValido && tipoEstadia && tipoVehiculoId)}
        />

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

interface ResumenPrecioProps {
  tarifa?: Tarifa;
  cantidad: number;
  /** Ya hay tipo de vehiculo, tipo de estadia e inicio para buscar la tarifa */
  completo: boolean;
}

function ResumenPrecio({ tarifa, cantidad, completo }: ResumenPrecioProps) {
  return (
    <div
      aria-live="polite"
      className="bg-primary/5 border-primary/20 flex flex-col gap-1 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-sm font-medium">Precio estimado</p>
        <p className="text-muted-foreground text-xs">
          {!completo
            ? 'Completá el tipo de vehículo, la estadía y la fecha para calcularlo.'
            : tarifa
              ? `${cantidad} × ${formatMoneda(tarifa.valor)} (tarifa ${tarifa.tipoVehiculo.tipo.toLowerCase()} · ${tarifa.tipoEstadia.tipo.toLowerCase()})`
              : 'No hay una tarifa vigente para ese vehículo y estadía en la fecha elegida.'}
        </p>
      </div>
      <p
        className={cn(
          'text-2xl font-semibold tabular-nums',
          tarifa ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        {completo && tarifa ? formatMoneda(estimarPrecio(tarifa, cantidad)) : '—'}
      </p>
    </div>
  );
}
