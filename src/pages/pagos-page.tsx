import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { EmptyMessage, ErrorMessage, ListSkeleton } from '@/components/query-states';
import { CampoSelect } from '@/features/cochera/campo-select';
import { ESTADO_PAGO_LABEL, METODO_PAGO_LABEL } from '@/features/pago/etiquetas-pago';
import { PagoList } from '@/features/pago/pago-list';
import {
  ESTADOS_PAGO,
  METODOS_PAGO,
  type EstadoPago,
  type FiltrosPagos,
  type MetodoPago,
} from '@/features/pago/pago.service';
import { usePagos } from '@/features/pago/use-pagos';

const TODOS = 'todos';

export function PagosPage() {
  const [filtros, setFiltros] = useState<FiltrosPagos>({});
  const pagos = usePagos(filtros);
  const hayFiltros = filtros.estado !== undefined || filtros.metodo !== undefined;

  return (
    <section>
      <PageHeader title="Pagos" description="Pagos de las reservas, con su método y estado." />

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <CampoSelect
          id="filtro-estado-pago"
          etiqueta="Estado"
          valor={filtros.estado ?? TODOS}
          opciones={[
            { valor: TODOS, texto: 'Todos' },
            ...ESTADOS_PAGO.map((estado) => ({ valor: estado, texto: ESTADO_PAGO_LABEL[estado] })),
          ]}
          onCambio={(valor) =>
            setFiltros((previo) => ({
              ...previo,
              estado: valor === TODOS ? undefined : (valor as EstadoPago),
            }))
          }
        />
        <CampoSelect
          id="filtro-metodo-pago"
          etiqueta="Método"
          valor={filtros.metodo ?? TODOS}
          opciones={[
            { valor: TODOS, texto: 'Todos' },
            ...METODOS_PAGO.map((metodo) => ({ valor: metodo, texto: METODO_PAGO_LABEL[metodo] })),
          ]}
          onCambio={(valor) =>
            setFiltros((previo) => ({
              ...previo,
              metodo: valor === TODOS ? undefined : (valor as MetodoPago),
            }))
          }
        />
      </div>

      {pagos.isPending ? (
        <ListSkeleton />
      ) : pagos.isError ? (
        <ErrorMessage message={pagos.error.message} onRetry={() => pagos.refetch()} />
      ) : pagos.data.length === 0 ? (
        <EmptyMessage>
          {hayFiltros ? 'No hay pagos con esos filtros.' : 'Todavía no hay pagos registrados.'}
        </EmptyMessage>
      ) : (
        <PagoList pagos={pagos.data} />
      )}
    </section>
  );
}