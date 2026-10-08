import { useQuery } from '@tanstack/react-query';
import type { Rol } from '@/types/models';
import { usuarioService } from './usuario.service';

export function useUsuarios(filtros: { rol?: Rol } = {}) {
  return useQuery({
    queryKey: ['usuarios', filtros],
    queryFn: () => usuarioService.list(filtros),
  });
}
