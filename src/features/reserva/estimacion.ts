import type { Tarifa } from '@/types/models';

/** Fin de la reserva: el inicio mas la cantidad de unidades del tipo de estadia */
export function calcularFin(inicio: Date, cantidad: number, duracionMinutos: number) {
  return new Date(inicio.getTime() + cantidad * duracionMinutos * 60_000);
}

/** Igual que la API: la tarifa con mayor fechaDesde que ya regia al inicio de la reserva */
export function buscarTarifaVigente(
  tarifas: Tarifa[],
  tipoVehiculoId: number,
  tipoEstadiaId: number,
  fecha: Date,
) {
  return tarifas
    .filter(
      (t) =>
        t.tipoVehiculo.id === tipoVehiculoId &&
        t.tipoEstadia.id === tipoEstadiaId &&
        new Date(t.fechaDesde) <= fecha,
    )
    .reduce<Tarifa | undefined>(
      (vigente, t) => (!vigente || t.fechaDesde > vigente.fechaDesde ? t : vigente),
      undefined,
    );
}

/** Con la duracion en unidades completas, el precio es valor x cantidad */
export function estimarPrecio(tarifa: Tarifa, cantidad: number) {
  return tarifa.valor * cantidad;
}
