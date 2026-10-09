import { Link } from 'react-router';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegistroForm } from '@/features/auth/registro-form';
import { useRegistro } from '@/features/auth/use-auth';

export function RegistroPage() {
  const registro = useRegistro();

  return (
    <section className="mx-auto w-full max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>Registrate para reservar cocheras.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <RegistroForm
            isPending={registro.isPending}
            errorMessage={registro.error?.message}
            onSubmit={(values) =>
              registro.mutate(values, {
                // La redireccion la hace GuestOnly al detectar la sesion
                onSuccess: ({ usuario }) => toast.success(`Cuenta creada. Hola, ${usuario.nombre}`),
              })
            }
          />
          <p className="text-muted-foreground text-center text-sm">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-foreground underline">
              Ingresá
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
