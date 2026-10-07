import { Link } from 'react-router';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/features/auth/login-form';
import { useLogin } from '@/features/auth/use-auth';

export function LoginPage() {
  const login = useLogin();

  return (
    <section className="mx-auto w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Ingresar</CardTitle>
          <CardDescription>Usá tu email y contraseña.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <LoginForm
            isPending={login.isPending}
            errorMessage={login.error?.message}
            onSubmit={(values) =>
              login.mutate(values, {
                // La redireccion la hace GuestOnly al detectar la sesion
                onSuccess: ({ usuario }) => toast.success(`Hola, ${usuario.nombre}`),
              })
            }
          />
          <p className="text-muted-foreground text-center text-sm">
            ¿No tenés cuenta?{' '}
            <Link to="/registro" className="text-foreground underline">
              Registrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
