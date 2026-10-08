import { useQuery } from '@tanstack/react-query';
import { cocheraService } from './cochera.service';

export function useCocheras() {
  return useQuery({ queryKey: ['cocheras'], queryFn: cocheraService.list });
}
