import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/use-auth';
import { useCocheras } from '@/features/cochera/use-cocheras';
import type { OpcionesQuery } from '@/features/reserva/opcion-select';
import { ReservaForm } from '@/features/reserva/reserva-form';
import type { CrearReservaInput } from '@/features/reserva/reserva.service';
import { useCrearReserva } from '@/features/reserva/use-reservas';
import { useTiposEstadia } from '@/features/tipo-estadia/use-tipos-estadia';
import { useTiposVehiculo } from '@/features/tipo-vehiculo/use-tipos-vehiculo';
import { useUsuarios } from '@/features/usuario/use-usuarios';
import { formatDuracion } from '@/lib/duracion';

/** Adapta una query de TanStack al formato de opciones del select */
function toOpciones<T>(
  query: { data?: T[]; isPending: boolean; isError: boolean },
  toOpcion: (item: T) => { value: number; label: string },
): OpcionesQuery {
  return {
    isPending: query.isPending,
    isError: query.isError,
    options: (query.data ?? []).map((item) => {
      const { value, label } = toOpcion(item);
      return { value: String(value), label };
    }),
  };
}

export function NuevaReservaPage() {
  const navigate = useNavigate();
  const crear = useCrearReserva();
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'ADMIN';
  const usuarios = useUsuarios({ rol: 'CLIENTE' }, { enabled: esAdmin });
  const cocheras = useCocheras();
  const tiposVehiculo = useTiposVehiculo();
  const tiposEstadia = useTiposEstadia();

  const opciones = {
    usuarios: toOpciones(usuarios, (u) => ({ value: u.id, label: `${u.nombre} (DNI ${u.dni})` })),
    cocheras: toOpciones(cocheras, (c) => ({
      value: c.id,
      label: `Cochera ${c.id}${c.playa ? ` · Playa ${c.playa.sector}` : ''}${c.techada ? ' · techada' : ''}`,
    })),
    tiposVehiculo: toOpciones(tiposVehiculo, (t) => ({ value: t.id, label: t.tipo })),
    tiposEstadia: toOpciones(tiposEstadia, (t) => ({
      value: t.id,
      label: `${t.tipo} (${formatDuracion(t.duracionMinutos)})`,
    })),
  };

  const guardar = async (data: CrearReservaInput) => {
    const reserva = await crear.mutateAsync(data);
    navigate(`/reservas/${reserva.id}`);
  };

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Nueva reserva</CardTitle>
          <CardDescription>
            Se valida que la cochera esté libre en ese horario y se calcula el precio.
            {!esAdmin && ' La reserva queda a tu nombre.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReservaForm
            opciones={opciones}
            elegirCliente={esAdmin}
            onSubmit={guardar}
            onCancel={() => navigate('/reservas')}
          />
        </CardContent>
      </Card>
    </section>
  );
}
