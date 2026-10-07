import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { tokenStorage } from '@/lib/token-storage';
import type { Usuario } from '@/types/models';
import { AuthContext, type AuthContextValue } from './auth-context';
import { authService } from './auth.service';

const perfilKey = ['auth', 'perfil'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const token = useSyncExternalStore(tokenStorage.subscribe, tokenStorage.get);

  // Al recargar la pagina, recupera el usuario a partir del token guardado
  const perfil = useQuery({
    queryKey: perfilKey,
    queryFn: authService.perfil,
    enabled: token !== null,
    staleTime: Infinity,
    retry: false,
  });

  // Sin sesion no debe quedar en cache nada de otro usuario
  useEffect(() => {
    if (token === null) queryClient.clear();
  }, [token, queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario: token ? (perfil.data ?? null) : null,
      isLoading: token !== null && perfil.isPending,
      iniciarSesion(nuevoToken: string, usuario: Usuario) {
        queryClient.setQueryData(perfilKey, usuario);
        tokenStorage.set(nuevoToken);
      },
      cerrarSesion() {
        tokenStorage.clear();
      },
    }),
    [token, perfil.data, perfil.isPending, queryClient],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
