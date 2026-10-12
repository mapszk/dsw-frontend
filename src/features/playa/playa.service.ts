import { apiClient } from '@/lib/api-client';
import type { Playa } from '@/types/models';

export type PlayaInput = Pick<Playa, 'sector'>;

export const playaService = {
  list: () => apiClient.get<Playa[]>('/playas'),
  get: (id: number) => apiClient.get<Playa>(`/playas/${id}`),
  create: (data: PlayaInput) => apiClient.post<Playa>('/playas', data),
  update: (id: number, data: Partial<PlayaInput>) =>
    apiClient.put<Playa>(`/playas/${id}`, data),
  delete: (id: number) => apiClient.delete(`/playas/${id}`),
};