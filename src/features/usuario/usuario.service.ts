import { apiClient } from '@/lib/api-client';
import type { Usuario } from '@/types/models';
import type { UsuarioPayload } from './usuario.schema';

export const usuarioService = {
  list: () => apiClient.get<Usuario[]>('/usuarios'),
  create: (data: UsuarioPayload) => apiClient.post<Usuario>('/usuarios', data),
  update: (id: number, data: UsuarioPayload) => apiClient.patch<Usuario>(`/usuarios/${id}`, data),
  remove: (id: number) => apiClient.delete(`/usuarios/${id}`),
};
