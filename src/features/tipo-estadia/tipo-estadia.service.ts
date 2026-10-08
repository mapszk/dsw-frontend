import { apiClient } from '@/lib/api-client';
import type { TipoEstadia } from '@/types/models';

export type TipoEstadiaInput = Pick<TipoEstadia, 'tipo' | 'duracionMinutos'>;

export const tipoEstadiaService = {
  list: () => apiClient.get<TipoEstadia[]>('/tipos-estadia'),
  get: (id: number) => apiClient.get<TipoEstadia>(`/tipos-estadia/${id}`),
  create: (data: TipoEstadiaInput) => apiClient.post<TipoEstadia>('/tipos-estadia', data),
  update: (id: number, data: Partial<TipoEstadiaInput>) =>
    apiClient.patch<TipoEstadia>(`/tipos-estadia/${id}`, data),
  delete: (id: number) => apiClient.delete(`/tipos-estadia/${id}`),
};
