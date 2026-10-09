import type { ReactNode } from 'react';
import { Link, Navigate, Outlet, useLocation, type Location } from 'react-router';
import { Button } from '@/components/ui/button';
import type { Rol } from '@/types/models';
import { useAuth } from './use-auth';

interface RequireAuthProps {
  /** Roles que pueden entrar. Sin indicar, alcanza con estar logueado. */
  roles?: Rol[];
  children?: ReactNode;
}

/** Protege rutas: sin sesion lleva al login (y vuelve despues); con otro rol muestra un aviso. */
export function RequireAuth({ roles, children }: RequireAuthProps) {
  const { usuario, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <p role="status" className="text-muted-foreground py-16 text-center">
        Cargando sesión...
      </p>
    );
  }

  if (!usuario) return <Navigate to="/login" replace state={{ from: location }} />;

  if (roles && !roles.includes(usuario.rol)) {
    return (
      <section className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-semibold">Sin permisos</h1>
        <p className="text-muted-foreground">Tu usuario no tiene acceso a esta sección.</p>
        <Button asChild>
          <Link to="/reservas">Volver a reservas</Link>
        </Button>
      </section>
    );
  }

  return children ?? <Outlet />;
}

/**
 * Login y registro: si ya hay sesion, no tiene sentido mostrarlos. Al iniciar sesion es este
 * componente el que redirige: a la ruta protegida que se habia pedido, o a reservas.
 */
export function GuestOnly() {
  const { usuario, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;
  if (usuario) {
    const destino = (location.state as { from?: Location } | null)?.from?.pathname ?? '/reservas';
    return <Navigate to={destino} replace />;
  }
  return <Outlet />;
}
