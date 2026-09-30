/** Formato de error que devuelve la API: { error: { message, details? } } */
export interface ApiErrorBody {
  error: {
    message: string;
    details?: unknown;
  };
}
