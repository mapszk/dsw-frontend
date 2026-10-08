import { apiClient } from '@/lib/api-client';
import type { TipoVehiculo } from '@/types/models';

export const tipoVehiculoService = {
  list: () => apiClient.get<TipoVehiculo[]>('/tipos-vehiculo'),
};
