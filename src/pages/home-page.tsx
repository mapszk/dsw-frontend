import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiStatus } from '@/features/health/api-status';
import { useHealth } from '@/features/health/use-health';

export function HomePage() {
  const health = useHealth();

  const status = health.isPending ? 'loading' : health.isError ? 'offline' : 'online';

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Gestion de reservas de estacionamiento</CardTitle>
          <CardDescription>Playas, cocheras, tarifas, reservas y pagos.</CardDescription>
        </CardHeader>
        <CardContent>
          <ApiStatus status={status} onRetry={() => health.refetch()} />
        </CardContent>
      </Card>
    </section>
  );
}
