import { apiClient } from '@/lib/api-client';

export interface HealthResponse {
  status: 'ok';
}

export const healthService = {
  check: () => apiClient.get<HealthResponse>('/health'),
};
