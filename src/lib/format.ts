const moneda = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
const fechaHora = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' });

export function formatMoneda(valor: number) {
  return moneda.format(valor);
}

export function formatFechaHora(iso: string) {
  return fechaHora.format(new Date(iso));
}
