import type { Tarifa } from '@/types/models';
import { buscarTarifaVigente, calcularFin, estimarPrecio } from './estimacion';

const auto = { id: 1, tipo: 'AUTO' };
const moto = { id: 2, tipo: 'MOTO' };
const hora = { id: 1, tipo: 'HORA', duracionMinutos: 60 };

const tarifa = (id: number, valor: number, fechaDesde: string, tipoVehiculo = auto): Tarifa => ({
  id,
  valor,
  fechaDesde,
  tipoVehiculo,
  tipoEstadia: hora,
});

describe('estimacion de reserva', () => {
  it('calcula el fin sumando unidades del tipo de estadia', () => {
    const inicio = new Date('2099-01-10T10:00:00Z');
    expect(calcularFin(inicio, 3, 60).toISOString()).toBe('2099-01-10T13:00:00.000Z');
  });

  it('usa la ultima tarifa que ya regia al inicio de la reserva', () => {
    const tarifas = [
      tarifa(1, 1000, '2026-01-01T00:00:00.000Z'),
      tarifa(2, 1500, '2026-06-01T00:00:00.000Z'),
      tarifa(3, 2000, '2027-01-01T00:00:00.000Z'),
      tarifa(4, 500, '2026-06-01T00:00:00.000Z', moto),
    ];
    const vigente = buscarTarifaVigente(tarifas, 1, 1, new Date('2026-10-15T12:00:00Z'));
    expect(vigente?.id).toBe(2);
    expect(estimarPrecio(vigente!, 3)).toBe(4500);
  });

  it('sin tarifa vigente devuelve undefined', () => {
    const tarifas = [tarifa(1, 1000, '2027-01-01T00:00:00.000Z')];
    expect(buscarTarifaVigente(tarifas, 1, 1, new Date('2026-10-15T12:00:00Z'))).toBeUndefined();
  });
});
