import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/use-auth';
import { formatDuracion } from '@/lib/duracion';
import { formatFechaHora, formatMoneda } from '@/lib/format';
import type { MetodoPago, Reserva } from '@/types/models';
import { RegistrarPagoButton } from './reserva-acciones';
import { PagarConMercadoPago } from '@/features/pago/pagar-con-mercadopago';
import { ESTADO_PAGO_LABEL } from '@/features/pago/etiquetas-pago';


const METODO_PAGO_LABEL: Record<MetodoPago, string> = {
  EFECTIVO: 'Efectivo',
  MERCADOPAGO: 'MercadoPago',
  TRANSFERENCIA: 'Transferencia',
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

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Reserva</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Dato label="Inicio">{formatFechaHora(reserva.fechaInicio)}</Dato>
            <Dato label="Fin">{formatFechaHora(reserva.fechaFin)}</Dato>
            <Dato label="Vehículo">{reserva.tipoVehiculo.tipo}</Dato>
            <Dato label="Estadía">
              {reserva.tipoEstadia.tipo} ({formatDuracion(reserva.tipoEstadia.duracionMinutos)})
            </Dato>
            <Dato label="Precio total">{formatMoneda(reserva.precioTotal)}</Dato>
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
              <Dato label="Fecha">{formatFechaHora(pago.fecha)}</Dato>
              <Dato label="Método">{METODO_PAGO_LABEL[pago.metodo]}</Dato>
              <Dato label="Estado">{ESTADO_PAGO_LABEL[pago.estado]}</Dato>
              <Dato label="Monto">{formatMoneda(pago.monto)}</Dato>
            </dl>
          ) : (
            <p className="text-muted-foreground text-sm">
              Sin pago registrado. Se registra cuando la reserva está activa.
            </p>
          )}
          {sesion?.rol === 'ADMIN' && reserva.estado === 'ACTIVA' && (
            <RegistrarPagoButton reservaId={reserva.id} />
          )}
          {sesion?.rol === 'CLIENTE' && (
            <PagarConMercadoPago
              reservaId={reserva.id}
              estadoReserva={reserva.estado}
              pagoAprobado={pago?.estado === 'APROBADO'}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
