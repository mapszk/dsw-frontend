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
    // Un 401 ya se resolvio en obtenerPerfil. Si la API esta despertando (5xx, timeout) se le da
    // mas margen que al resto de las consultas antes de mostrar el error
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failureCount < 4,
    retryDelay: (intento) => Math.min(1000 * 2 ** intento, 10_000),
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
      sinConexion: perfil.isError,
      reintentar() {
        void perfil.refetch();
      },
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
    [perfil, queryClient, terminarSesion],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
