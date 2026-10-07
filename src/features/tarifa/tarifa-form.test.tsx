import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TarifaForm } from './tarifa-form';

const props = {
  tiposVehiculo: [{ id: 1, tipo: 'AUTO' }],
  tiposEstadia: [{ id: 2, tipo: 'HORA', duracionMinutos: 60 }],
};

describe('TarifaForm', () => {
  it('convierte los valores del formulario a lo que espera la API', async () => {
    const onSubmit = vi.fn();
    render(
      <TarifaForm
        {...props}
        defaultValues={{
          tipoVehiculoId: '1',
          tipoEstadiaId: '2',
          valor: '1500',
          fechaDesde: '2026-12-01',
        }}
        onSubmit={onSubmit}
      />,
    );

    const valor = screen.getByLabelText('Valor ($)');
    await userEvent.clear(valor);
    await userEvent.type(valor, '1850,50');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onSubmit).toHaveBeenCalledWith({
      tipoVehiculoId: 1,
      tipoEstadiaId: 2,
      valor: 1850.5,
      fechaDesde: '2026-12-01T00:00:00.000Z',
    });
  });

  it('pide completar los datos obligatorios', async () => {
    const onSubmit = vi.fn();
    render(<TarifaForm {...props} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Valor ($)'), '10.555');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('Elegí un tipo de vehículo')).toBeInTheDocument();
    expect(screen.getByText('Elegí un tipo de estadía')).toBeInTheDocument();
    expect(
      screen.getByText('Ingresá un importe válido, con hasta 2 decimales'),
    ).toBeInTheDocument();
    expect(screen.getByText('Elegí desde cuándo rige')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
