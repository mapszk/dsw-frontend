import { estaVencida, puedeCancelarse, puedeEliminarse } from './estado-reserva';

const ahora = new Date('2026-10-15T12:00:00Z');
const futura = { fechaInicio: '2026-10-20T10:00:00Z', fechaFin: '2026-10-20T12:00:00Z' };
const empezada = { fechaInicio: '2026-10-15T10:00:00Z', fechaFin: '2026-10-15T14:00:00Z' };
const terminada = { fechaInicio: '2026-10-10T10:00:00Z', fechaFin: '2026-10-10T12:00:00Z' };

describe('reglas de estado de una reserva', () => {
  it('un cliente cancela reservas pendientes o activas antes de que empiecen', () => {
    expect(puedeCancelarse({ estado: 'PENDIENTE', ...futura }, 'CLIENTE', ahora)).toBe(true);
    expect(puedeCancelarse({ estado: 'ACTIVA', ...futura }, 'CLIENTE', ahora)).toBe(true);
    expect(puedeCancelarse({ estado: 'ACTIVA', ...empezada }, 'CLIENTE', ahora)).toBe(false);
    expect(puedeCancelarse({ estado: 'PAGADA', ...futura }, 'CLIENTE', ahora)).toBe(false);
  });

  it('un admin cancela pendientes o activas en cualquier momento, pero no pagadas', () => {
    expect(puedeCancelarse({ estado: 'ACTIVA', ...empezada }, 'ADMIN', ahora)).toBe(true);
    expect(puedeCancelarse({ estado: 'PENDIENTE', ...terminada }, 'ADMIN', ahora)).toBe(true);
    expect(puedeCancelarse({ estado: 'PAGADA', ...futura }, 'ADMIN', ahora)).toBe(false);
    expect(puedeCancelarse({ estado: 'CANCELADA', ...futura }, 'ADMIN', ahora)).toBe(false);
  });

  it('una pendiente o activa cuyo horario termino esta vencida', () => {
    expect(estaVencida({ estado: 'PENDIENTE', ...terminada }, ahora)).toBe(true);
    expect(estaVencida({ estado: 'ACTIVA', ...terminada }, ahora)).toBe(true);
    expect(estaVencida({ estado: 'ACTIVA', ...empezada }, ahora)).toBe(false);
    expect(estaVencida({ estado: 'PAGADA', ...terminada }, ahora)).toBe(false);
  });

  it('se eliminan reservas pendientes o canceladas', () => {
    expect(puedeEliminarse('PENDIENTE')).toBe(true);
    expect(puedeEliminarse('CANCELADA')).toBe(true);
    expect(puedeEliminarse('ACTIVA')).toBe(false);
  });
});
