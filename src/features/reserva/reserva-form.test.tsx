import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiError } from '@/lib/api-client';
import type { OpcionesQuery } from './opcion-select';
import { ReservaForm, type ReservaFormOpciones } from './reserva-form';

const opcion = (value: string, label: string): OpcionesQuery => ({
  isPending: false,
  isError: false,
  options: [{ value, label }],
});

const opciones: ReservaFormOpciones = {
  usuarios: opcion('2', 'Cliente Demo'),
  cocheras: opcion('1', 'Cochera 1'),
  tiposVehiculo: opcion('1', 'AUTO'),
  tiposEstadia: opcion('1', 'HORA'),
};

async function elegir(user: ReturnType<typeof userEvent.setup>, campo: string, valor: string) {
  await user.click(screen.getByRole('combobox', { name: campo }));
  await user.click(await screen.findByRole('option', { name: valor }));
}

async function completarFormulario(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Patente'), 'ab 123-cd');
  await user.type(screen.getByLabelText('Inicio'), '2099-01-10T10:00');
  await user.type(screen.getByLabelText('Fin'), '2099-01-10T12:00');
  await elegir(user, 'Cliente', 'Cliente Demo');
  await elegir(user, 'Cochera', 'Cochera 1');
  await elegir(user, 'Tipo de vehículo', 'AUTO');
  await elegir(user, 'Tipo de estadía', 'HORA');
}

describe('ReservaForm', () => {
  it('muestra los errores de validacion sin llamar a la API', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ReservaForm opciones={opciones} onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('Patente'), 'XYZ');
    await user.click(screen.getByRole('button', { name: 'Crear reserva' }));

    expect(await screen.findByText(/Patente inválida/)).toBeInTheDocument();
    expect(screen.getByText('Ingresá la fecha de inicio')).toBeInTheDocument();
    expect(screen.getByText('Elegí una cochera')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('envia los datos normalizados y muestra el error de la API', async () => {
    const user = userEvent.setup();
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new ApiError(409, 'La cochera ya esta reservada en ese horario'));
    render(<ReservaForm opciones={opciones} onSubmit={onSubmit} onCancel={vi.fn()} />);

    await completarFormulario(user);
    await user.click(screen.getByRole('button', { name: 'Crear reserva' }));

    expect(onSubmit).toHaveBeenCalledWith({
      patente: 'AB123CD',
      fechaInicio: new Date('2099-01-10T10:00').toISOString(),
      fechaFin: new Date('2099-01-10T12:00').toISOString(),
      usuarioId: 2,
      cocheraId: 1,
      tipoVehiculoId: 1,
      tipoEstadiaId: 1,
    });
    expect(
      await screen.findByText('La cochera ya esta reservada en ese horario'),
    ).toBeInTheDocument();
  });

  it('un cliente no elige el cliente: la reserva se envia sin usuarioId', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({});
    render(
      <ReservaForm
        opciones={opciones}
        elegirCliente={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.queryByRole('combobox', { name: 'Cliente' })).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('Patente'), 'ab 123-cd');
    await user.type(screen.getByLabelText('Inicio'), '2099-01-10T10:00');
    await user.type(screen.getByLabelText('Fin'), '2099-01-10T12:00');
    await elegir(user, 'Cochera', 'Cochera 1');
    await elegir(user, 'Tipo de vehículo', 'AUTO');
    await elegir(user, 'Tipo de estadía', 'HORA');
    await user.click(screen.getByRole('button', { name: 'Crear reserva' }));

    // Sin usuarioId: la API deja la reserva a nombre del usuario logueado
    expect(onSubmit).toHaveBeenCalledWith({
      patente: 'AB123CD',
      fechaInicio: new Date('2099-01-10T10:00').toISOString(),
      fechaFin: new Date('2099-01-10T12:00').toISOString(),
      cocheraId: 1,
      tipoVehiculoId: 1,
      tipoEstadiaId: 1,
    });
  });
});
