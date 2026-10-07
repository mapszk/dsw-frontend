import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from '@/lib/api-client';

/**
 * Muestra en el formulario el error que devolvio la API: los errores de validacion (400)
 * van a cada campo y el mensaje general queda en `root`.
 */
export function aplicarErroresApi<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  if (!(error instanceof ApiError)) {
    setError('root', { message: 'Ocurrio un error inesperado' });
    return;
  }

  if (error.status === 400 && error.details && typeof error.details === 'object') {
    for (const [campo, mensajes] of Object.entries(error.details)) {
      if (Array.isArray(mensajes) && mensajes.length > 0) {
        setError(campo as Path<T>, { message: String(mensajes[0]) });
      }
    }
  }

  setError('root', { message: error.message });
}
