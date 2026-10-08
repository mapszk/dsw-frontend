import { aMinutos, desdeMinutos, formatDuracion } from './duracion';

describe('duracion', () => {
  it('convierte cada unidad a minutos', () => {
    expect(aMinutos(90, 'MINUTOS')).toBe(90);
    expect(aMinutos(2, 'HORAS')).toBe(120);
    expect(aMinutos(1, 'DIAS')).toBe(1440);
    expect(aMinutos(1, 'SEMANAS')).toBe(10080);
    expect(aMinutos(1, 'MESES')).toBe(43200);
  });

  it('elige la unidad mas grande que sea exacta', () => {
    expect(desdeMinutos(43200)).toEqual({ cantidad: 1, unidad: 'MESES' });
    expect(desdeMinutos(20160)).toEqual({ cantidad: 2, unidad: 'SEMANAS' });
    expect(desdeMinutos(2880)).toEqual({ cantidad: 2, unidad: 'DIAS' });
    expect(desdeMinutos(90)).toEqual({ cantidad: 90, unidad: 'MINUTOS' });
  });

  it('formatea la duracion de forma legible', () => {
    expect(formatDuracion(45)).toBe('45 minutos');
    expect(formatDuracion(60)).toBe('1 hora');
    expect(formatDuracion(1440)).toBe('1 día');
    expect(formatDuracion(43200)).toBe('1 mes');
  });
});
