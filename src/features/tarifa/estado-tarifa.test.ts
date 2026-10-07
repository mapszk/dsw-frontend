import type { Tarifa } from '@/types/models';
import { calcularEstadosTarifas } from './estado-tarifa';

const auto = { id: 1, tipo: 'AUTO' };
const moto = { id: 2, tipo: 'MOTO' };
const hora = { id: 1, tipo: 'HORA', duracionMinutos: 60 };

function tarifa(id: number, fechaDesde: string, tipoVehiculo = auto): Tarifa {
  return { id, valor: 1000, fechaDesde, tipoVehiculo, tipoEstadia: hora };
}

describe('calcularEstadosTarifas', () => {
  const ahora = new Date('2026-10-07T12:00:00Z');

  it('marca vigente la ultima que ya empezo, anterior a las viejas y programada a las futuras', () => {
    const estados = calcularEstadosTarifas(
      [
        tarifa(1, '2026-01-01T00:00:00.000Z'),
        tarifa(2, '2026-06-01T00:00:00.000Z'),
        tarifa(3, '2026-12-01T00:00:00.000Z'),
      ],
      ahora,
    );

    expect(estados.get(1)).toBe('anterior');
    expect(estados.get(2)).toBe('vigente');
    expect(estados.get(3)).toBe('programada');
  });

  it('calcula la vigente por separado para cada tipo de vehiculo', () => {
    const estados = calcularEstadosTarifas(
      [tarifa(1, '2026-06-01T00:00:00.000Z'), tarifa(2, '2026-01-01T00:00:00.000Z', moto)],
      ahora,
    );

    expect(estados.get(1)).toBe('vigente');
    expect(estados.get(2)).toBe('vigente');
  });
});
