import { apiClient } from '@/lib/api-client';
import type { Cochera } from '@/types/models';

export const cocheraService = {
  list: () => apiClient.get<Cochera[]>('/cocheras'),
};
