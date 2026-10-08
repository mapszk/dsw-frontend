import { useQuery } from '@tanstack/react-query';
import { tipoVehiculoService } from './tipo-vehiculo.service';

export function useTiposVehiculo() {
  return useQuery({ queryKey: ['tipos-vehiculo'], queryFn: tipoVehiculoService.list });
}
