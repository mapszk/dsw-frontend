import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistroForm } from './registro-form';

async function completar(datos: Record<string, string>) {
  for (const [label, valor] of Object.entries(datos)) {
    await userEvent.type(screen.getByLabelText(label), valor);
  }
}

const datosValidos = {
  'Nombre y apellido': 'Bruno Cussitt',
  DNI: '40123456',
  Email: 'bruno@dsw.com',
  Contraseña: 'secreto123',
  'Repetir contraseña': 'secreto123',
};

describe('RegistroForm', () => {
  it('valida DNI y que las contraseñas coincidan', async () => {
    const onSubmit = vi.fn();
    render(<RegistroForm onSubmit={onSubmit} />);

    await completar({ ...datosValidos, DNI: '40.123', 'Repetir contraseña': 'otra-clave' });
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(
      await screen.findByText('El DNI debe tener 7 u 8 dígitos, sin puntos'),
    ).toBeInTheDocument();
    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('envia los datos con el telefono vacio si no se completa', async () => {
    const onSubmit = vi.fn();
    render(<RegistroForm onSubmit={onSubmit} />);

    await completar(datosValidos);
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        nombre: 'Bruno Cussitt',
        dni: '40123456',
        email: 'bruno@dsw.com',
        telefono: '',
        password: 'secreto123',
        confirmarPassword: 'secreto123',
      },
      expect.anything(),
    );
  });
});
