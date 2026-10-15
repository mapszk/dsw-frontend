import { PageHeader } from '@/components/page-header';
import { EmptyMessage, ErrorMessage, ListSkeleton } from '@/components/query-states';
import { PagoList } from '@/features/pago/pago-list';
import { usePagos } from '@/features/pago/use-pagos';

export function PagosPage() {
  const pagos = usePagos();

  return (
    <section>
      <PageHeader title="Pagos" description="Pagos registrados al finalizar las reservas." />

      {pagos.isPending ? (
        <ListSkeleton />
      ) : pagos.isError ? (
        <ErrorMessage message={pagos.error.message} onRetry={() => pagos.refetch()} />
      ) : pagos.data.length === 0 ? (
        <EmptyMessage>Todavía no hay pagos registrados.</EmptyMessage>
      ) : (
        <PagoList pagos={pagos.data} />
      )}
    </section>
  );
}
