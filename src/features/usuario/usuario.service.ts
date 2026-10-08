import { apiClient } from '@/lib/api-client';
import type { Rol, Usuario } from '@/types/models';

export const usuarioService = {
  list: (filtros: { rol?: Rol } = {}) =>
    apiClient.get<Usuario[]>(`/usuarios${filtros.rol ? `?rol=${filtros.rol}` : ''}`),
};
