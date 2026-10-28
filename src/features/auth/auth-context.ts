import { createContext } from 'react';
import type { Usuario } from '@/types/models';

export interface AuthContextValue {
  /** Usuario logueado, o null si no hay sesion */
  usuario: Usuario | null;
  /** Todavia se esta preguntando a la API si hay una sesion abierta */
  isLoading: boolean;
  /** No se pudo averiguar la sesion (API caida o despertando): no es lo mismo que no tener sesion */
  sinConexion: boolean;
  /** Vuelve a preguntar a la API por la sesion */
  reintentar: () => void;
  /** Se llama despues del login o registro: la API ya dejo la cookie de sesion */
  iniciarSesion: (usuario: Usuario) => void;
  cerrarSesion: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
