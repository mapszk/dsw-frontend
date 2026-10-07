import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiStatus } from './api-status';

describe('ApiStatus', () => {
  it('muestra que la API esta en linea', () => {
    render(<ApiStatus status="online" />);

    expect(screen.getByText('API en linea')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Reintentar' })).not.toBeInTheDocument();
  });

  it('permite reintentar cuando la API no responde', async () => {
    const onRetry = vi.fn();
    render(<ApiStatus status="offline" onRetry={onRetry} />);

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(screen.getByText('API sin conexion')).toBeInTheDocument();
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
