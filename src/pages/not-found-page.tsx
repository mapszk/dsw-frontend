import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <section className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="font-heading text-2xl font-semibold">Pagina no encontrada</h1>
      <p className="text-muted-foreground">La direccion que buscas no existe.</p>
      <Button asChild>
        <Link to="/">Volver al inicio</Link>
      </Button>
    </section>
  );
}
