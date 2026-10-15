import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayaForm } from './playa-form';

describe('PlayaForm', () => {
  it('envia el sector sin espacios sobrantes', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<PlayaForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('Sector'), '  Norte ');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onSubmit).toHaveBeenCalledWith({ sector: 'Norte' });
  });

  it('no envia y muestra un error si el sector esta vacio', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PlayaForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('Ingresá un sector')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('carga el sector de la playa al editar', () => {
    render(
      <PlayaForm
        playa={{
          id: 1,
          sector: 'Sur',
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Sector')).toHaveValue('Sur');
  });
});