import { apiClient } from '@/lib/api-client';
import type { TipoEstadia } from '@/types/models';

export const tipoEstadiaService = {
  list: () => apiClient.get<TipoEstadia[]>('/tipos-estadia'),
};
