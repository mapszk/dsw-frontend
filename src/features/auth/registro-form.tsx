import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registroSchema, type RegistroValues } from './auth.schema';

interface RegistroFormProps {
  onSubmit: (values: RegistroValues) => void;
  isPending?: boolean;
  /** Error devuelto por la API (ej: email o DNI ya registrado) */
  errorMessage?: string;
}

interface CampoProps {
  id: keyof RegistroValues;
  label: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: 'numeric' | 'tel';
  registration: UseFormRegisterReturn;
}

function Campo({ id, label, error, registration, ...inputProps }: CampoProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
        {...registration}
      />
    </FormField>
  );
}

export function RegistroForm({ onSubmit, isPending = false, errorMessage }: RegistroFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nombre: '',
      dni: '',
      email: '',
      telefono: '',
      password: '',
      confirmarPassword: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Campo
          id="nombre"
          label="Nombre y apellido"
          autoComplete="name"
          error={errors.nombre?.message}
          registration={register('nombre')}
        />
      </div>
      <Campo
        id="dni"
        label="DNI"
        inputMode="numeric"
        error={errors.dni?.message}
        registration={register('dni')}
      />
      <Campo
        id="telefono"
        label="Teléfono (opcional)"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        error={errors.telefono?.message}
        registration={register('telefono')}
      />
      <div className="sm:col-span-2">
        <Campo
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          registration={register('email')}
        />
      </div>
      <Campo
        id="password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        registration={register('password')}
      />
      <Campo
        id="confirmarPassword"
        label="Repetir contraseña"
        type="password"
        autoComplete="new-password"
        error={errors.confirmarPassword?.message}
        registration={register('confirmarPassword')}
      />

      {errorMessage && (
        <p role="alert" className="text-destructive text-sm sm:col-span-2">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full sm:col-span-2">
        {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>
    </form>
  );
}
