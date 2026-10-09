import { apiClient } from '@/lib/api-client';
import type { TipoVehiculo } from '@/types/models';
import type { TipoVehiculoValues } from './tipo-vehiculo.schema';

export const tipoVehiculoService = {
  list: () => apiClient.get<TipoVehiculo[]>('/tipos-vehiculo'),
  create: (data: TipoVehiculoValues) => apiClient.post<TipoVehiculo>('/tipos-vehiculo', data),
  update: (id: number, data: TipoVehiculoValues) =>
    apiClient.patch<TipoVehiculo>(`/tipos-vehiculo/${id}`, data),
  remove: (id: number) => apiClient.delete(`/tipos-vehiculo/${id}`),
};
