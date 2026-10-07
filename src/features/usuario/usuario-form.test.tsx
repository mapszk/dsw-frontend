import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsuarioForm } from './usuario-form';

const existente = {
  nombre: 'Cliente Demo',
  dni: '11111111',
  email: 'cliente@dsw.com',
  telefono: '',
  password: '',
  rol: 'CLIENTE' as const,
};

describe('UsuarioForm', () => {
  it('al crear exige la contraseña', async () => {
    const onSubmit = vi.fn();
    render(<UsuarioForm modo="crear" defaultValues={existente} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(
      await screen.findByText('La contraseña debe tener al menos 8 caracteres'),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('al editar sin contraseña no la envia y manda el telefono vacio como null', async () => {
    const onSubmit = vi.fn();
    render(<UsuarioForm modo="editar" defaultValues={existente} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onSubmit).toHaveBeenCalledWith({
      nombre: 'Cliente Demo',
      dni: '11111111',
      email: 'cliente@dsw.com',
      telefono: null,
      rol: 'CLIENTE',
    });
  });

  it('al editar con contraseña nueva la envia', async () => {
    const onSubmit = vi.fn();
    render(<UsuarioForm modo="editar" defaultValues={existente} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Nueva contraseña (opcional)'), 'nueva-clave');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onSubmit.mock.calls[0][0].password).toBe('nueva-clave');
  });
});
