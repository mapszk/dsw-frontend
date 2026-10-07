import { apiClient } from '@/lib/api-client';
import type { Tarifa } from '@/types/models';
import type { TarifaPayload } from './tarifa.schema';

export const tarifaService = {
  list: () => apiClient.get<Tarifa[]>('/tarifas'),
  create: (data: TarifaPayload) => apiClient.post<Tarifa>('/tarifas', data),
  update: (id: number, data: TarifaPayload) => apiClient.patch<Tarifa>(`/tarifas/${id}`, data),
  remove: (id: number) => apiClient.delete(`/tarifas/${id}`),
};
