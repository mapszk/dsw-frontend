import { apiClient } from '@/lib/api-client';

export const ESTADOS_COCHERA = ['DISPONIBLE', 'OCUPADA', 'INHABILITADA'] as const;
export type EstadoCochera = (typeof ESTADOS_COCHERA)[number];

export interface CocheraAdmin {
  id: number;
  techada: boolean;
  estado: EstadoCochera;
  playaId: number;
  playa?: { id: number; sector: string };
}

export interface PlayaOpcion {
  id: number;
  sector: string;
}

export interface CocheraInput {
  techada: boolean;
  estado: EstadoCochera;
  playaId: number;
}

export interface FiltrosCocheras {
  playaId?: number;
  estado?: EstadoCochera;
  techada?: boolean;
}

export const cocheraAdminService = {
  async list(filtros: FiltrosCocheras) {
    // Con una playa elegida se usa el listado filtrado de la API
    if (filtros.playaId) {
      const params = new URLSearchParams();
      if (filtros.estado) params.set('estado', filtros.estado);
      if (filtros.techada !== undefined) params.set('techada', String(filtros.techada));
      const texto = params.toString();
      return apiClient.get<CocheraAdmin[]>(
        `/playas/${filtros.playaId}/cocheras${texto ? `?${texto}` : ''}`,
      );
    }
    const todas = await apiClient.get<CocheraAdmin[]>('/cocheras');
    return todas.filter(
      (c) =>
        (!filtros.estado || c.estado === filtros.estado) &&
        (filtros.techada === undefined || c.techada === filtros.techada),
    );
  },
  listPlayas: () => apiClient.get<PlayaOpcion[]>('/playas'),
  create: (data: CocheraInput) => apiClient.post<CocheraAdmin>('/cocheras', data),
  update: (id: number, data: CocheraInput) => apiClient.put<CocheraAdmin>(`/cocheras/${id}`, data),
  remove: (id: number) => apiClient.delete<void>(`/cocheras/${id}`),
};