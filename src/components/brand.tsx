import { CarFront } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

interface BrandProps {
  className?: string;
}

/** Logo de la app: icono de auto + nombre */
export function Brand({ className }: BrandProps) {
  return (
    <Link to="/" className={cn('flex shrink-0 items-center gap-2', className)}>
      <span
        aria-hidden
        className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg shadow-sm"
      >
        <CarFront className="size-5" />
      </span>
      <span className="font-heading text-base font-semibold tracking-tight">Estacionamiento</span>
    </Link>
  );
}
