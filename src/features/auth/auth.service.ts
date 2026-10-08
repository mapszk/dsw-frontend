import { apiClient } from '@/lib/api-client';
import type { Usuario } from '@/types/models';
import type { LoginValues, RegistroValues } from './auth.schema';

/** El token no viene en la respuesta: la API lo deja en una cookie httpOnly */
export interface AuthResponse {
  usuario: Usuario;
}

export const authService = {
  login: (data: LoginValues) => apiClient.post<AuthResponse>('/auth/login', data),
  registrar: ({ confirmarPassword: _confirmar, telefono, ...data }: RegistroValues) =>
    apiClient.post<AuthResponse>('/auth/register', { ...data, telefono: telefono || undefined }),
  perfil: () => apiClient.get<Usuario>('/auth/me'),
  logout: () => apiClient.post<void>('/auth/logout'),
};
