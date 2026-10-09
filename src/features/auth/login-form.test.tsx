import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './login-form';

describe('LoginForm', () => {
  it('muestra errores y no envia si faltan datos', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByText('Ingresa tu email')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('envia el email y la contraseña', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Email'), 'cliente@dsw.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'dsw12345');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(onSubmit).toHaveBeenCalledWith(
      { email: 'cliente@dsw.com', password: 'dsw12345' },
      expect.anything(),
    );
  });

  it('muestra el error de la API y deshabilita el boton mientras ingresa', () => {
    render(
      <LoginForm onSubmit={vi.fn()} isPending errorMessage="Email o contraseña incorrectos" />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Email o contraseña incorrectos');
    expect(screen.getByRole('button', { name: 'Ingresando...' })).toBeDisabled();
  });
});
