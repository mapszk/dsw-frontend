import { useQuery } from '@tanstack/react-query';
import { healthService } from './health.service';

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: healthService.check,
    refetchInterval: 30_000,
  });
}
