import { formatDuracion } from './format';

describe('formatDuracion', () => {
  it('expresa la duracion en la unidad mas grande que sea exacta', () => {
    expect(formatDuracion(45)).toBe('45 min');
    expect(formatDuracion(60)).toBe('1 h');
    expect(formatDuracion(1440)).toBe('1 día');
    expect(formatDuracion(43200)).toBe('30 días');
  });
});
