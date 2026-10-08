import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tipoEstadiaService, type TipoEstadiaInput } from './tipo-estadia.service';

export function useTiposEstadia() {
  return useQuery({ queryKey: ['tipos-estadia'], queryFn: tipoEstadiaService.list });
}

export function useCrearTipoEstadia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tipoEstadiaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-estadia'] });
      toast.success('Tipo de estadía creado');
    },
  });
}

export function useActualizarTipoEstadia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TipoEstadiaInput> }) =>
      tipoEstadiaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-estadia'] });
      toast.success('Tipo de estadía actualizado');
    },
  });
}

export function useEliminarTipoEstadia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tipoEstadiaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-estadia'] });
      toast.success('Tipo de estadía eliminado');
    },
    onError: (error) => toast.error(error.message),
  });
}
