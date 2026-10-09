import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TarifaForm } from './tarifa-form';

const props = {
  tiposVehiculo: [{ id: 1, tipo: 'AUTO' }],
  tiposEstadia: [{ id: 2, tipo: 'HORA', duracionMinutos: 60 }],
};

// Fechas relativas a hoy: con fechas fijas el test dejaria de pasar cuando queden en el pasado
const enUnMes = new Date(Date.now() + 30 * 24 * 60 * 60_000).toISOString().slice(0, 10);

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
          fechaDesde: enUnMes,
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
      fechaDesde: `${enUnMes}T00:00:00.000Z`,
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

  it('no permite una fecha que no sea futura', async () => {
    const onSubmit = vi.fn();
    const hoy = new Date().toISOString().slice(0, 10);
    render(
      <TarifaForm
        {...props}
        defaultValues={{ tipoVehiculoId: '1', tipoEstadiaId: '2', valor: '1500', fechaDesde: hoy }}
        onSubmit={onSubmit}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('Elegí una fecha posterior a hoy')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
