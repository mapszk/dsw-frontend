import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { playaService, type PlayaInput } from './playa.service';

export function usePlayas() {
  return useQuery({ queryKey: ['playas'], queryFn: playaService.list });
}

export function useCrearPlaya() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: playaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playas'] });
      toast.success('Playa creada');
    },
  });
}

export function useActualizarPlaya() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PlayaInput> }) =>
      playaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playas'] });
      toast.success('Playa actualizada');
    },
  });
}

export function useEliminarPlaya() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: playaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playas'] });
      toast.success('Playa eliminada');
    },
    onError: (error) => toast.error(error.message),
  });
}