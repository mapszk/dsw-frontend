import {
  BadgeDollarSign,
  CalendarClock,
  Car,
  Clock,
  House,
  LogOut,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/features/auth/use-auth';
import { cn } from '@/lib/utils';
import type { Rol } from '@/types/models';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Sin indicar, lo ve cualquier usuario logueado */
  roles?: Rol[];
}

const links: NavItem[] = [
  { to: '/', label: 'Inicio', icon: House },
  { to: '/reservas', label: 'Reservas', icon: CalendarClock },
  { to: '/usuarios', label: 'Usuarios', icon: Users, roles: ['ADMIN'] },
  { to: '/tipos-vehiculo', label: 'Tipos de vehículo', icon: Car, roles: ['ADMIN'] },
  { to: '/tipos-estadia', label: 'Tipos de estadía', icon: Clock, roles: ['ADMIN'] },
  { to: '/tarifas', label: 'Tarifas', icon: BadgeDollarSign, roles: ['ADMIN'] },
];

function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('');
}

export function AppLayout() {
  const { usuario, cerrarSesion } = useAuth();
  const visibles = usuario
    ? links.filter((link) => !link.roles || link.roles.includes(usuario.rol))
    : [];

  return (
    <div className="flex min-h-svh flex-col">
      {usuario ? (
        <header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden
                className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
              >
                {iniciales(usuario.nombre)}
              </span>
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-sm font-medium">{usuario.nombre}</span>
                <span className="text-muted-foreground text-xs">
                  {usuario.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={cerrarSesion}>
              <LogOut aria-hidden />
              Salir
            </Button>
          </div>

          <nav aria-label="Secciones" className="mx-auto max-w-6xl px-4 pb-3">
            <ul className="bg-muted/60 flex [scrollbar-width:none] gap-1 overflow-x-auto rounded-xl p-1">
              {visibles.map((link) => (
                <li key={link.to} className="shrink-0">
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'text-muted-foreground hover:bg-background/70 hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                        isActive &&
                          'bg-background text-foreground hover:bg-background shadow-sm ring-1 ring-black/5',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <link.icon
                          aria-hidden
                          className={cn('size-4', isActive && 'text-primary')}
                        />
                        {link.label}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </header>
      ) : (
        <header className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <span className="font-heading text-lg font-semibold">Estacionamiento</span>
          </div>
        </header>
      )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-8">
        <Outlet />
      </main>

      <Toaster richColors />
    </div>
  );
}
