import { useQuery } from '@tanstack/react-query';
import { pagoService } from './pago.service';

export function usePagos() {
  return useQuery({ queryKey: ['pagos'], queryFn: () => pagoService.list() });
}