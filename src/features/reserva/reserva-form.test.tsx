import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiError } from '@/lib/api-client';
import type { Tarifa, TipoEstadia } from '@/types/models';
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

const tiposEstadia: TipoEstadia[] = [{ id: 1, tipo: 'HORA', duracionMinutos: 60 }];
const tarifas: Tarifa[] = [
  {
    id: 1,
    valor: 1500,
    fechaDesde: '2026-01-01T00:00:00.000Z',
    tipoVehiculo: { id: 1, tipo: 'AUTO' },
    tipoEstadia: tiposEstadia[0],
  },
];
const datos = { opciones, tiposEstadia, tarifas };

async function elegir(user: ReturnType<typeof userEvent.setup>, campo: string, valor: string) {
  await user.click(screen.getByRole('combobox', { name: campo }));
  await user.click(await screen.findByRole('option', { name: valor }));
}

/** El slider arranca en 1 hora: con la flecha derecha se suma una hora por vez */
async function elegirHoras(user: ReturnType<typeof userEvent.setup>, horas: number) {
  const slider = screen.getByRole('slider', { name: 'Duración' });
  slider.focus();
  await user.keyboard('{ArrowRight}'.repeat(horas - 1));
}

async function completarFormulario(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Patente'), 'ab 123-cd');
  await elegir(user, 'Cliente', 'Cliente Demo');
  await elegir(user, 'Tipo de vehículo', 'AUTO');
  await elegir(user, 'Tipo de estadía', 'HORA');
  await user.type(screen.getByLabelText('¿Cuándo llegás?'), '2099-01-10T10:00');
  await elegirHoras(user, 2);
  await elegir(user, 'Cochera', 'Cochera 1');
}

describe('ReservaForm', () => {
  it('muestra los errores de validacion sin llamar a la API', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ReservaForm {...datos} onSubmit={onSubmit} onCancel={vi.fn()} />);

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
    render(<ReservaForm {...datos} onSubmit={onSubmit} onCancel={vi.fn()} />);

    await completarFormulario(user);
    // 2 horas x $1.500
    expect(screen.getByText(/3\.000,00/)).toBeInTheDocument();
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
    render(<ReservaForm {...datos} elegirCliente={false} onSubmit={onSubmit} onCancel={vi.fn()} />);

    expect(screen.queryByRole('combobox', { name: 'Cliente' })).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('Patente'), 'ab 123-cd');
    await elegir(user, 'Tipo de vehículo', 'AUTO');
    await elegir(user, 'Tipo de estadía', 'HORA');
    await user.type(screen.getByLabelText('¿Cuándo llegás?'), '2099-01-10T10:00');
    await elegirHoras(user, 2);
    await elegir(user, 'Cochera', 'Cochera 1');
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
