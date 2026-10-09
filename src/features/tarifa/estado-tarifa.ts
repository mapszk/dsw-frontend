import type { Tarifa } from '@/types/models';

/**
 * - vigente: la que se cobra hoy para su tipo de vehiculo y estadia
 * - programada: empieza a regir en el futuro (la unica que se puede editar o eliminar)
 * - anterior: reemplazada por una mas nueva; queda como historial
 */
export type EstadoTarifa = 'vigente' | 'programada' | 'anterior';

export function calcularEstadosTarifas(tarifas: Tarifa[], ahora = new Date()) {
  const vigentes = new Map<string, Tarifa>();
  for (const tarifa of tarifas) {
    if (new Date(tarifa.fechaDesde) > ahora) continue;
    const clave = `${tarifa.tipoVehiculo.id}-${tarifa.tipoEstadia.id}`;
    const actual = vigentes.get(clave);
    if (!actual || tarifa.fechaDesde > actual.fechaDesde) vigentes.set(clave, tarifa);
  }

  const vigentesIds = new Set([...vigentes.values()].map((tarifa) => tarifa.id));
  return new Map<number, EstadoTarifa>(
    tarifas.map((tarifa) => [
      tarifa.id,
      new Date(tarifa.fechaDesde) > ahora
        ? 'programada'
        : vigentesIds.has(tarifa.id)
          ? 'vigente'
          : 'anterior',
    ]),
  );
}
