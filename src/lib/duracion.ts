// Unidades para cargar duraciones. La API guarda todo en minutos; un mes se toma como 30 dias.
export const UNIDADES_DURACION = [
  { value: 'MINUTOS', minutos: 1, singular: 'minuto', plural: 'minutos' },
  { value: 'HORAS', minutos: 60, singular: 'hora', plural: 'horas' },
  { value: 'DIAS', minutos: 60 * 24, singular: 'día', plural: 'días' },
  { value: 'SEMANAS', minutos: 60 * 24 * 7, singular: 'semana', plural: 'semanas' },
  { value: 'MESES', minutos: 60 * 24 * 30, singular: 'mes', plural: 'meses' },
] as const;

export type UnidadDuracion = (typeof UNIDADES_DURACION)[number]['value'];

const unidad = (value: UnidadDuracion) => UNIDADES_DURACION.find((u) => u.value === value)!;

export function aMinutos(cantidad: number, value: UnidadDuracion) {
  return cantidad * unidad(value).minutos;
}

/** Expresa los minutos en la unidad mas grande que los divida exacto: 43200 -> 1 MESES */
export function desdeMinutos(minutos: number): { cantidad: number; unidad: UnidadDuracion } {
  const exacta = [...UNIDADES_DURACION].reverse().find((u) => minutos % u.minutos === 0)!;
  return { cantidad: minutos / exacta.minutos, unidad: exacta.value };
}

export function formatDuracion(minutos: number) {
  const { cantidad, unidad: value } = desdeMinutos(minutos);
  const { singular, plural } = unidad(value);
  return `${cantidad} ${cantidad === 1 ? singular : plural}`;
}
