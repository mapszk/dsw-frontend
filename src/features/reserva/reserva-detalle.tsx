
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/features/auth/use-auth';
import { formatDuracion } from '@/lib/duracion';
import { formatFechaHora, formatMoneda } from '@/lib/format';
import type { MetodoPago, Pago, Reserva } from '@/types/models';
import {
  PagarConMercadoPagoButton,
  RegistrarPagoButton,
} from './reserva-acciones';

const METODO_PAGO_LABEL: Record<MetodoPago, string> = {
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta',
  TRANSFERENCIA: 'Transferencia',
  ONLINE: 'MercadoPago',
};

const ESTADO_PAGO_LABEL: Record<Pago['estado'], string> = {
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
};

interface DatoProps {
  label: string;
  children: React.ReactNode;
}

function Dato({ label, children }: DatoProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

export function ReservaDetalle({ reserva }: { reserva: Reserva }) {
  const { usuario, cochera, pago } = reserva;
  const { usuario: sesion } = useAuth();

  const esPropietario = sesion?.id === usuario.id;
  const esAdmin = sesion?.rol === 'ADMIN';
  const reservaActiva = reserva.estado === 'ACTIVA';

  // Un pago online rechazado no bloquea: se puede volver a pagar o registrar el pago a mano
  const sinPagoAprobado = pago?.estado !== 'APROBADO';

  const puedePagarConMercadoPago = reservaActiva && sinPagoAprobado;

  const puedeRegistrarPagoManual = reservaActiva && sinPagoAprobado && esAdmin;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Reserva</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Dato label="Inicio">
              {formatFechaHora(reserva.fechaInicio)}
            </Dato>
            <Dato label="Fin">
              {formatFechaHora(reserva.fechaFin)}
            </Dato>
            <Dato label="Vehículo">{reserva.tipoVehiculo.tipo}</Dato>
            <Dato label="Estadía">
              {reserva.tipoEstadia.tipo} (
              {formatDuracion(reserva.tipoEstadia.duracionMinutos)})
            </Dato>
            <Dato label="Precio total">
              {formatMoneda(reserva.precioTotal)}
            </Dato>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <Dato label="Nombre">{usuario.nombre}</Dato>
            <Dato label="DNI">{usuario.dni}</Dato>
            <Dato label="Email">
              <span className="break-all">{usuario.email}</span>
            </Dato>
            <Dato label="Teléfono">{usuario.telefono ?? '—'}</Dato>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cochera</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <Dato label="Playa">Sector {cochera.playa.sector}</Dato>
            <Dato label="Cochera">N° {cochera.id}</Dato>
            <Dato label="Techada">{cochera.techada ? 'Sí' : 'No'}</Dato>
          </dl>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pago ? (
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Dato label="Fecha">
                {formatFechaHora(pago.fecha)}
              </Dato>
              <Dato label="Método">
                {METODO_PAGO_LABEL[pago.metodo]}
              </Dato>
              <Dato label="Monto">{formatMoneda(pago.monto)}</Dato>
              <Dato label="Estado">{ESTADO_PAGO_LABEL[pago.estado]}</Dato>
            </dl>
          ) : (
            <p className="text-muted-foreground text-sm">
              Sin pago registrado. Se puede pagar cuando la reserva está activa.
            </p>
          )}

          {puedePagarConMercadoPago && esPropietario && (
            <PagarConMercadoPagoButton reservaId={reserva.id} />
          )}

          {puedeRegistrarPagoManual && (
            <RegistrarPagoButton reservaId={reserva.id} />
          )}

          {reservaActiva && sinPagoAprobado && esPropietario && (
            <p className="text-muted-foreground text-sm">
              Si preferís pagar en efectivo o por transferencia, coordiná el pago
              con la administración.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
