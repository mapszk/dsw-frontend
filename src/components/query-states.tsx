import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2" aria-label="Cargando">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="border-destructive/30 bg-destructive/5 flex flex-col items-start gap-3 rounded-lg border p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-destructive">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}

export function EmptyMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
      {children}
    </p>
  );
}
