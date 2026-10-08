import { env } from '@/config/env';
import { sessionEvents } from '@/lib/session-events';
import type { ApiErrorBody } from '@/types/api';

/** Error de una llamada a la API, con el status HTTP y el mensaje que devolvio el backend */
export class ApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

// En estas rutas un 401 es una respuesta esperada (credenciales incorrectas o todavia sin sesion)
const RUTAS_SIN_SESION = ['/auth/login', '/auth/register', '/auth/me'];

/**
 * Wrapper de fetch para hablar con la API: agrega la URL base, serializa JSON,
 * envia la cookie de sesion y convierte las respuestas de error en ApiError.
 */
async function request<T>(path: string, { body, headers, ...options }: RequestOptions = {}) {
  let response: Response;
  try {
    response = await fetch(`${env.VITE_API_URL}${path}`, {
      ...options,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      // Envia la cookie httpOnly de sesion tambien si la API esta en otro dominio (deploy)
      credentials: 'include',
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor');
  }

  // Sesion vencida o invalida: se avisa para cerrarla y que las rutas protegidas lleven al login
  if (response.status === 401 && !RUTAS_SIN_SESION.includes(path)) sessionEvents.expirada();

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = (data as ApiErrorBody | null)?.error;
    throw new ApiError(response.status, error?.message ?? 'Error inesperado', error?.details);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T = void>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
