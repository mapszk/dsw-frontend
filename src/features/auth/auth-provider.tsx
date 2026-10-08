import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { ApiError } from '@/lib/api-client';
import { sessionEvents } from '@/lib/session-events';
import type { Usuario } from '@/types/models';
import { AuthContext, type AuthContextValue } from './auth-context';
import { authService } from './auth.service';

const perfilKey = ['auth', 'perfil'];

/** El token esta en una cookie httpOnly que no se puede leer: la sesion se averigua con la API */
async function obtenerPerfil(): Promise<Usuario | null> {
  try {
    return await authService.perfil();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const perfil = useQuery({
    queryKey: perfilKey,
    queryFn: obtenerPerfil,
    staleTime: Infinity,
    retry: false,
  });

  const terminarSesion = useCallback(() => {
    // Sin sesion no debe quedar en cache nada de otro usuario
    queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== 'auth' });
    queryClient.setQueryData(perfilKey, null);
  }, [queryClient]);

  // Un 401 en cualquier pedido (por ejemplo, la cookie vencio) cierra la sesion
  useEffect(() => sessionEvents.subscribe(terminarSesion), [terminarSesion]);

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario: perfil.data ?? null,
      isLoading: perfil.isPending,
      iniciarSesion(usuario: Usuario) {
        queryClient.setQueryData(perfilKey, usuario);
      },
      async cerrarSesion() {
        // La cookie es httpOnly: solo la API puede borrarla
        try {
          await authService.logout();
        } finally {
          terminarSesion();
        }
      },
    }),
    [perfil.data, perfil.isPending, queryClient, terminarSesion],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
