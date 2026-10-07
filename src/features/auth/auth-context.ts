import { createContext } from 'react';
import type { Usuario } from '@/types/models';

export interface AuthContextValue {
  /** Usuario logueado, o null si no hay sesion */
  usuario: Usuario | null;
  /** Hay un token guardado y todavia se esta validando contra la API */
  isLoading: boolean;
  iniciarSesion: (token: string, usuario: Usuario) => void;
  cerrarSesion: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
