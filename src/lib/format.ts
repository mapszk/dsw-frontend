const moneda = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

// Las fechas "desde" de las tarifas se guardan como medianoche UTC (igual que el seed de la API):
// se muestran en UTC para que el dia no se corra por la zona horaria
const fechaUtc = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeZone: 'UTC' });

const fechaHora = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' });

export function formatFechaHora(iso: string) {
  return fechaHora.format(new Date(iso));
}

/** Fecha ISO -> "2026-10-09T09:00" en hora local, para un <input type="datetime-local"> */
export function toInputDateTime(iso: string) {
  const fecha = new Date(iso);
  const local = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function formatMoneda(valor: number) {
  return moneda.format(valor);
}

export function formatFechaUtc(iso: string) {
  return fechaUtc.format(new Date(iso));
}

/** "2026-12-01T00:00:00.000Z" -> "2026-12-01", para un <input type="date"> */
export function toInputDate(iso: string) {
  return iso.slice(0, 10);
}

/** "2026-12-01" -> "2026-12-01T00:00:00.000Z" */
export function fromInputDate(fecha: string) {
  return new Date(`${fecha}T00:00:00Z`).toISOString();
}
