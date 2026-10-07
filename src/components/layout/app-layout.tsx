import { LogOut } from 'lucide-react';
import { NavLink, Outlet } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/features/auth/use-auth';
import { cn } from '@/lib/utils';
import type { Rol } from '@/types/models';

interface NavItem {
  to: string;
  label: string;
  /** Sin indicar, lo ve cualquier usuario logueado */
  roles?: Rol[];
}

const links: NavItem[] = [
  { to: '/', label: 'Inicio' },
  { to: '/tipos-vehiculo', label: 'Tipos de vehículo', roles: ['ADMIN'] },
];

export function AppLayout() {
  const { usuario, cerrarSesion } = useAuth();
  const visibles = usuario
    ? links.filter((link) => !link.roles || link.roles.includes(usuario.rol))
    : [];

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-heading text-lg font-semibold">Estacionamiento</span>
          {usuario && (
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <nav className="flex gap-4 text-sm">
                {visibles.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end
                    className={({ isActive }) =>
                      cn(
                        'text-muted-foreground hover:text-foreground',
                        isActive && 'text-foreground',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              <div className="flex items-center gap-2 text-sm">
                <span className="max-w-40 truncate">{usuario.nombre}</span>
                <Badge variant="secondary">{usuario.rol === 'ADMIN' ? 'Admin' : 'Cliente'}</Badge>
                <Button variant="outline" size="sm" onClick={cerrarSesion}>
                  <LogOut aria-hidden />
                  Salir
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-8">
        <Outlet />
      </main>

      <Toaster richColors />
    </div>
  );
}
