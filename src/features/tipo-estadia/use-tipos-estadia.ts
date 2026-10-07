import { useQuery } from '@tanstack/react-query';
import { tipoEstadiaService } from './tipo-estadia.service';

export function useTiposEstadia() {
  return useQuery({ queryKey: ['tipos-estadia'], queryFn: tipoEstadiaService.list });
}
