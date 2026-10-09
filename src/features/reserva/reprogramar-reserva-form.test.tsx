import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReprogramarReservaForm } from './reprogramar-reserva-form';

function cambiar(label: string, valor: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value: valor } });
}

describe('ReprogramarReservaForm', () => {
  const props = {
    fechaInicio: '2030-01-10T12:00:00.000Z',
    fechaFin: '2030-01-10T15:00:00.000Z',
  };

  it('envia las nuevas fechas en ISO', async () => {
    const onSubmit = vi.fn();
    render(<ReprogramarReservaForm {...props} onSubmit={onSubmit} />);

    cambiar('Nuevo inicio', '2030-02-01T09:00');
    cambiar('Nuevo fin', '2030-02-01T11:30');
    await userEvent.click(screen.getByRole('button', { name: 'Reprogramar' }));

    expect(onSubmit).toHaveBeenCalledWith({
      fechaInicio: new Date('2030-02-01T09:00').toISOString(),
      fechaFin: new Date('2030-02-01T11:30').toISOString(),
    });
  });

  it('no permite un fin anterior al inicio', async () => {
    const onSubmit = vi.fn();
    render(<ReprogramarReservaForm {...props} onSubmit={onSubmit} />);

    cambiar('Nuevo fin', '2030-01-10T08:00');
    await userEvent.click(screen.getByRole('button', { name: 'Reprogramar' }));

    expect(
      await screen.findByText('La fecha de fin debe ser posterior a la de inicio'),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('no permite reprogramar al pasado', async () => {
    const onSubmit = vi.fn();
    render(<ReprogramarReservaForm {...props} onSubmit={onSubmit} />);

    cambiar('Nuevo inicio', '2020-01-10T09:00');
    cambiar('Nuevo fin', '2020-01-10T11:00');
    await userEvent.click(screen.getByRole('button', { name: 'Reprogramar' }));

    expect(
      await screen.findByText('La fecha de inicio no puede estar en el pasado'),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
