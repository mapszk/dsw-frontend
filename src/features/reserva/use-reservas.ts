import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  reservaService,
  type ActualizarReservaInput,
  type ReservaFiltros,
} from './reserva.service';

export function useReservas(filtros: ReservaFiltros = {}) {
  return useQuery({
    queryKey: ['reservas', filtros],
    queryFn: () => reservaService.list(filtros),
  });
}

export function useReserva(id: number) {
  return useQuery({
    queryKey: ['reservas', id],
    queryFn: () => reservaService.get(id),
  });
}

export function useCrearReserva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reservaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      toast.success('Reserva creada');
    },
  });
}

export function useActualizarReserva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarReservaInput }) =>
      reservaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      toast.success('Reserva actualizada');
    },
  });
}

export function useEliminarReserva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reservaService.delete,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ['reservas', id] });
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      toast.success('Reserva eliminada');
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCancelarReserva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reservaService.cancelar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      toast.success('Reserva cancelada');
    },
    onError: (error) => toast.error(error.message),
  });
}
