const moneda = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
const fechaHora = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' });

export function formatMoneda(valor: number) {
  return moneda.format(valor);
}

export function formatFechaHora(iso: string) {
  return fechaHora.format(new Date(iso));
}

/** Duracion legible a partir de minutos: 90 min, 1 h, 1 dia, 30 dias */
export function formatDuracion(minutos: number) {
  if (minutos % 1440 === 0) {
    const dias = minutos / 1440;
    return `${dias} ${dias === 1 ? 'día' : 'días'}`;
  }
  if (minutos % 60 === 0) return `${minutos / 60} h`;
  return `${minutos} min`;
}
