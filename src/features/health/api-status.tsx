import { Badge } from '@/components/ui/badge';

interface ApiStatusProps {
  status: 'loading' | 'online' | 'offline';
  onRetry?: () => void;
}

const labels: Record<ApiStatusProps['status'], string> = {
  loading: 'Verificando API...',
  online: 'API en linea',
  offline: 'API sin conexion',
};

export function ApiStatus({ status, onRetry }: ApiStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant={status === 'offline' ? 'destructive' : 'secondary'}>{labels[status]}</Badge>
      {status === 'offline' && onRetry && (
        <button type="button" className="text-sm underline" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}
