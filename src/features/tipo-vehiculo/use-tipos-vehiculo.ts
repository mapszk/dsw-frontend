import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { TipoVehiculoValues } from './tipo-vehiculo.schema';
import { tipoVehiculoService } from './tipo-vehiculo.service';

const key = ['tipos-vehiculo'];

export function useTiposVehiculo() {
  return useQuery({ queryKey: key, queryFn: tipoVehiculoService.list });
}

function useInvalidar() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: key });
    // Las tarifas muestran el nombre del tipo de vehiculo
    queryClient.invalidateQueries({ queryKey: ['tarifas'] });
  };
}

export function useCrearTipoVehiculo() {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: tipoVehiculoService.create,
    onSuccess: () => {
      invalidar();
      toast.success('Tipo de vehículo creado');
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useActualizarTipoVehiculo() {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TipoVehiculoValues }) =>
      tipoVehiculoService.update(id, data),
    onSuccess: () => {
      invalidar();
      toast.success('Tipo de vehículo actualizado');
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useEliminarTipoVehiculo() {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: tipoVehiculoService.remove,
    onSuccess: () => {
      invalidar();
      toast.success('Tipo de vehículo eliminado');
    },
    onError: (error) => toast.error(error.message),
  });
}
