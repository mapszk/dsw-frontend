import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  crearUsuarioSchema,
  editarUsuarioSchema,
  toUsuarioPayload,
  type UsuarioPayload,
  type UsuarioValues,
} from './usuario.schema';

interface UsuarioFormProps {
  modo: 'crear' | 'editar';
  defaultValues?: UsuarioValues;
  isPending?: boolean;
  onSubmit: (data: UsuarioPayload) => void;
}

const vacio: UsuarioValues = {
  nombre: '',
  dni: '',
  email: '',
  telefono: '',
  password: '',
  rol: 'CLIENTE',
};

interface CampoProps {
  id: keyof UsuarioValues;
  label: string;
  error?: string;
  type?: string;
  inputMode?: 'numeric' | 'tel';
  autoComplete?: string;
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

export function UsuarioForm({
  modo,
  defaultValues = vacio,
  isPending = false,
  onSubmit,
}: UsuarioFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UsuarioValues>({
    resolver: zodResolver(modo === 'crear' ? crearUsuarioSchema : editarUsuarioSchema),
    defaultValues,
  });

  return (
    <form
      noValidate
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={handleSubmit((values) => onSubmit(toUsuarioPayload(values)))}
    >
      <div className="sm:col-span-2">
        <Campo
          id="nombre"
          label="Nombre y apellido"
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
        error={errors.telefono?.message}
        registration={register('telefono')}
      />
      <div className="sm:col-span-2">
        <Campo
          id="email"
          label="Email"
          type="email"
          error={errors.email?.message}
          registration={register('email')}
        />
      </div>
      <Campo
        id="password"
        label={modo === 'crear' ? 'Contraseña' : 'Nueva contraseña (opcional)'}
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        registration={register('password')}
      />
      <FormField id="rol" label="Rol" error={errors.rol?.message}>
        <Controller
          control={control}
          name="rol"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="rol" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLIENTE">Cliente</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <Button type="submit" disabled={isPending} className="sm:col-span-2">
        {isPending ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
}
