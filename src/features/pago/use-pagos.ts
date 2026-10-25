import { useQuery } from '@tanstack/react-query';
import { pagoService, type FiltrosPagos } from './pago.service';

export function usePagos(filtros: FiltrosPagos = {}) {
  return useQuery({
    queryKey: ['pagos', filtros],
    queryFn: () => pagoService.list(filtros),
  });
}