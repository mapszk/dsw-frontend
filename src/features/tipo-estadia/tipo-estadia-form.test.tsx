import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TipoEstadiaForm } from './tipo-estadia-form';

describe('TipoEstadiaForm', () => {
  it('convierte la duracion a minutos antes de enviar', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TipoEstadiaForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('Nombre'), 'QUINCENA');
    await user.type(screen.getByLabelText('Duración'), '2');
    await user.click(screen.getByRole('combobox', { name: 'Unidad de duración' }));
    await user.click(await screen.findByRole('option', { name: 'Semanas' }));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onSubmit).toHaveBeenCalledWith({ tipo: 'QUINCENA', duracionMinutos: 20160 });
  });

  it('muestra la duracion guardada en la unidad mas grande', () => {
    render(
      <TipoEstadiaForm
        tipoEstadia={{ id: 3, tipo: 'MES', duracionMinutos: 43200 }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Duración')).toHaveValue(1);
    expect(screen.getByRole('combobox', { name: 'Unidad de duración' })).toHaveTextContent('Meses');
  });
});
