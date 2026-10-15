import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  cocheraAdminService,
  type CocheraInput,
  type FiltrosCocheras,
} from './cochera-admin.service';

const mensajeDe = (error: unknown) =>
  error instanceof Error ? error.message : 'Ocurrió un error inesperado';

export function useCocherasAdmin(filtros: FiltrosCocheras) {
  return useQuery({
    queryKey: ['cocheras', 'admin', filtros],
    queryFn: () => cocheraAdminService.list(filtros),
  });
}

export function usePlayasOpciones() {
  return useQuery({
    queryKey: ['playas', 'opciones'],
    queryFn: () => cocheraAdminService.listPlayas(),
  });
}

export function useGuardarCochera() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: CocheraInput }) =>
      id ? cocheraAdminService.update(id, data) : cocheraAdminService.create(data),
    onSuccess: async (_resultado, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['cocheras'] });
      toast.success(variables.id ? 'Cochera actualizada' : 'Cochera creada');
    },
    onError: (error) => toast.error(mensajeDe(error)),
  });
}

export function useEliminarCochera() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cocheraAdminService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cocheras'] });
      toast.success('Cochera eliminada');
    },
    onError: (error) => toast.error(mensajeDe(error)),
  });
}