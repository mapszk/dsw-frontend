import { NavLink, Outlet } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/reservas', label: 'Reservas' },
  { to: '/tipos-estadia', label: 'Tipos de estadía' },
];

export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-heading text-lg font-semibold">DSW Estacionamiento</span>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn('text-muted-foreground hover:text-foreground', isActive && 'text-foreground')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-8">
        <Outlet />
      </main>

      <Toaster richColors />
    </div>
  );
}
