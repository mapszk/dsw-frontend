import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface QueryStateProps {
  isPending: boolean;
  error: Error | null;
  isEmpty: boolean;
  emptyMessage: string;
  onRetry: () => void;
  children: ReactNode;
}

/** Estados de carga, error y vacio de un listado; si hay datos muestra children. */
export function QueryState({
  isPending,
  error,
  isEmpty,
  emptyMessage,
  onRetry,
  children,
}: QueryStateProps) {
  if (isPending) {
    return (
      <div role="status" aria-label="Cargando" className="grid gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-start gap-2 py-6">
        <p className="text-destructive text-sm">{error.message}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (isEmpty) return <p className="text-muted-foreground py-6 text-sm">{emptyMessage}</p>;

  return children;
}
