import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { TarifaPayload } from './tarifa.schema';
import { tarifaService } from './tarifa.service';

const key = ['tarifas'];

export function useTarifas() {
  return useQuery({ queryKey: key, queryFn: tarifaService.list });
}

export function useCrearTarifa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tarifaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      toast.success('Tarifa creada');
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useActualizarTarifa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TarifaPayload }) =>
      tarifaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      toast.success('Tarifa actualizada');
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useEliminarTarifa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tarifaService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      toast.success('Tarifa eliminada');
    },
    onError: (error) => toast.error(error.message),
  });
}
