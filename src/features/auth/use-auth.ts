import { useMutation } from '@tanstack/react-query';
import { use } from 'react';
import { AuthContext } from './auth-context';
import { authService } from './auth.service';

export function useAuth() {
  const context = use(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}

export function useLogin() {
  const { iniciarSesion } = useAuth();
  return useMutation({
    mutationFn: authService.login,
    onSuccess: ({ token, usuario }) => iniciarSesion(token, usuario),
  });
}

export function useRegistro() {
  const { iniciarSesion } = useAuth();
  return useMutation({
    mutationFn: authService.registrar,
    onSuccess: ({ token, usuario }) => iniciarSesion(token, usuario),
  });
}
