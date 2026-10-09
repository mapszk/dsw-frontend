import { puedeCancelarse, puedeEliminarse } from './estado-reserva';

describe('reglas de estado de una reserva', () => {
  it('un cliente cancela solo reservas pendientes', () => {
    expect(puedeCancelarse('PENDIENTE', 'CLIENTE')).toBe(true);
    expect(puedeCancelarse('ACTIVA', 'CLIENTE')).toBe(false);
    expect(puedeCancelarse('FINALIZADA', 'CLIENTE')).toBe(false);
    expect(puedeCancelarse('CANCELADA', 'CLIENTE')).toBe(false);
  });

  it('un admin tambien cancela reservas activas', () => {
    expect(puedeCancelarse('PENDIENTE', 'ADMIN')).toBe(true);
    expect(puedeCancelarse('ACTIVA', 'ADMIN')).toBe(true);
    expect(puedeCancelarse('FINALIZADA', 'ADMIN')).toBe(false);
  });

  it('se eliminan reservas pendientes o canceladas', () => {
    expect(puedeEliminarse('PENDIENTE')).toBe(true);
    expect(puedeEliminarse('CANCELADA')).toBe(true);
    expect(puedeEliminarse('ACTIVA')).toBe(false);
  });
});
