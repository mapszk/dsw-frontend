import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Rol } from '@/types/models';
import type { UsuarioPayload } from './usuario.schema';
import { usuarioService } from './usuario.service';

const key = ['usuarios'];

/** La API devuelve todos los usuarios: el filtro por rol (ej: clientes para una reserva) se aplica aca */
export function useUsuarios(filtros: { rol?: Rol } = {}) {
  return useQuery({
    queryKey: key,
    queryFn: usuarioService.list,
    select: (usuarios) =>
      filtros.rol ? usuarios.filter((usuario) => usuario.rol === filtros.rol) : usuarios,
  });
}

export function useCrearUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usuarioService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      toast.success('Usuario creado');
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useActualizarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UsuarioPayload }) =>
      usuarioService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      toast.success('Usuario actualizado');
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useEliminarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usuarioService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      toast.success('Usuario eliminado');
    },
    onError: (error) => toast.error(error.message),
  });
}
