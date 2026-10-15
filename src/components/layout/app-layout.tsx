import { useState } from 'react';
import {
  BadgeDollarSign,
  CalendarClock,
  Car,
  ChevronDown,
  Clock,
  LogOut,
  Menu,
  ParkingSquare,
  Receipt,
  Settings2,
  Users,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { Brand } from '@/components/brand';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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

/** Secciones relacionadas que se muestran juntas en un menu desplegable */
interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavItem[];
}

type NavEntry = NavItem | NavGroup;

const navegacion: NavEntry[] = [
  { to: '/reservas', label: 'Reservas', icon: CalendarClock },
  { to: '/pagos', label: 'Pagos', icon: Receipt, roles: ['ADMIN'] },
  { to: '/usuarios', label: 'Usuarios', icon: Users, roles: ['ADMIN'] },
  {
    label: 'Estacionamiento',
    icon: ParkingSquare,
    items: [
      { to: '/playas', label: 'Playas', icon: ParkingSquare, roles: ['ADMIN'] },
      { to: '/cocheras', label: 'Cocheras', icon: Warehouse, roles: ['ADMIN'] },
    ],
  },
  {
    label: 'Configuración',
    icon: Settings2,
    items: [
      { to: '/tarifas', label: 'Tarifas', icon: BadgeDollarSign, roles: ['ADMIN'] },
      { to: '/tipos-vehiculo', label: 'Tipos de vehículo', icon: Car, roles: ['ADMIN'] },
      { to: '/tipos-estadia', label: 'Tipos de estadía', icon: Clock, roles: ['ADMIN'] },
    ],
  },
];

function esGrupo(entry: NavEntry): entry is NavGroup {
  return 'items' in entry;
}

function puedeVer(item: NavItem, rol: Rol) {
  return !item.roles || item.roles.includes(rol);
}

/** Filtra por rol; un grupo que queda con un solo item se muestra como link suelto */
function navegacionVisible(rol: Rol): NavEntry[] {
  return navegacion.flatMap<NavEntry>((entry) => {
    if (!esGrupo(entry)) return puedeVer(entry, rol) ? [entry] : [];
    const items = entry.items.filter((item) => puedeVer(item, rol));
    if (items.length === 0) return [];
    if (items.length === 1) return items;
    return [{ ...entry, items }];
  });
}

const navItemClass =
  'text-muted-foreground hover:bg-background/70 hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors';
const navItemActiveClass =
  'bg-card text-primary hover:bg-card hover:text-primary shadow-sm ring-1 ring-primary/15';

function NavGroupMenu({ group }: { group: NavGroup }) {
  const { pathname } = useLocation();
  const activo = group.items.find(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(navItemClass, 'outline-none', activo && navItemActiveClass)}
      >
        <group.icon aria-hidden className={cn('size-4', activo && 'text-primary')} />
        {group.label}
        <ChevronDown aria-hidden className="size-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto min-w-48">
        {group.items.map((item) => (
          <DropdownMenuItem key={item.to} asChild>
            <Link
              to={item.to}
              aria-current={activo === item ? 'page' : undefined}
              className={cn('gap-2 py-1.5', activo === item && 'text-primary font-medium')}
            >
              <item.icon aria-hidden />
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const mobileItemClass =
  'text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors';
const mobileItemActiveClass = 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary';

interface MobileNavLinkProps {
  item: NavItem;
  onNavegar: () => void;
}

function MobileNavLink({ item, onNavegar }: MobileNavLinkProps) {
  return (
    <li>
      <NavLink
        to={item.to}
        onClick={onNavegar}
        className={({ isActive }) => cn(mobileItemClass, isActive && mobileItemActiveClass)}
      >
        {({ isActive }) => (
          <>
            <item.icon aria-hidden className={cn('size-5', isActive && 'text-primary')} />
            {item.label}
          </>
        )}
      </NavLink>
    </li>
  );
}

interface MobileNavProps {
  entries: NavEntry[];
  nombre: string;
  rol: Rol;
  onCerrarSesion: () => void;
}

/** Menu lateral a pantalla completa para celular, con las secciones en lista vertical */
function MobileNav({ entries, nombre, rol, onCerrarSesion }: MobileNavProps) {
  const sueltos = entries.filter((entry): entry is NavItem => !esGrupo(entry));
  const grupos = entries.filter(esGrupo);
  const [abierto, setAbierto] = useState(false);
  const cerrar = () => setAbierto(false);

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
          <Menu aria-hidden className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="data-[side=left]:w-full data-[side=left]:sm:max-w-none">
        <SheetHeader className="border-b">
          <SheetTitle>{nombre}</SheetTitle>
          <SheetDescription>{rol === 'ADMIN' ? 'Administrador' : 'Cliente'}</SheetDescription>
        </SheetHeader>

        <nav aria-label="Secciones" className="flex-1 overflow-y-auto px-4">
          <ul className="flex flex-col gap-1">
            {sueltos.map((item) => (
              <MobileNavLink key={item.to} item={item} onNavegar={cerrar} />
            ))}
          </ul>
          {grupos.map((group) => (
            <section key={group.label} className="mt-6">
              <h2 className="text-muted-foreground mb-1 px-3 text-xs font-semibold tracking-wide uppercase">
                {group.label}
              </h2>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <MobileNavLink key={item.to} item={item} onNavegar={cerrar} />
                ))}
              </ul>
            </section>
          ))}
        </nav>

        <SheetFooter className="border-t">
          <Button variant="outline" onClick={onCerrarSesion}>
            <LogOut aria-hidden />
            Salir
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

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
  const visibles = usuario ? navegacionVisible(usuario.rol) : [];

  return (
    <div className="flex min-h-svh flex-col">
      {usuario ? (
        <header className="bg-card/95 supports-backdrop-filter:bg-card/80 border-t-primary sticky top-0 z-40 border-t-3 border-b backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <div className="flex min-w-0 items-center gap-1">
              <MobileNav
                entries={visibles}
                nombre={usuario.nombre}
                rol={usuario.rol}
                onCerrarSesion={cerrarSesion}
              />
              <Brand />
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <div className="hidden min-w-0 flex-col text-right leading-tight sm:flex">
                <span className="truncate text-sm font-medium">{usuario.nombre}</span>
                <span className="text-muted-foreground text-xs">
                  {usuario.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}
                </span>
              </div>
              <span
                aria-hidden
                className="bg-primary/10 text-primary ring-primary/20 flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-1"
              >
                {iniciales(usuario.nombre)}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex"
                onClick={cerrarSesion}
              >
                <LogOut aria-hidden />
                Salir
              </Button>
            </div>
          </div>

          <nav aria-label="Secciones" className="mx-auto hidden max-w-6xl px-4 pb-3 md:block">
            <ul className="bg-muted/60 flex gap-1 rounded-xl p-1">
              {visibles.map((entry) =>
                esGrupo(entry) ? (
                  <li key={entry.label} className="shrink-0">
                    <NavGroupMenu group={entry} />
                  </li>
                ) : (
                  <li key={entry.to} className="shrink-0">
                    <NavLink
                      to={entry.to}
                      className={({ isActive }) => cn(navItemClass, isActive && navItemActiveClass)}
                    >
                      {({ isActive }) => (
                        <>
                          <entry.icon
                            aria-hidden
                            className={cn('size-4', isActive && 'text-primary')}
                          />
                          {entry.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </header>
      ) : (
        <header className="bg-card border-t-primary border-t-3 border-b">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <Brand />
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
