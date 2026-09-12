import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Navigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/form/TextField';
import { BrandMark } from '../../components/BrandMark';
import { getDefaultRoute } from '../../utils/permissions';
import { LoginHero } from './LoginHero';

const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { isAuthenticated, user, login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
    } catch {
      setServerError('Credenciales inválidas. Verifica tu email y contraseña.');
    }
  };

  if (isAuthenticated) return <Navigate to={getDefaultRoute(user?.permissions ?? [])} replace />;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <LoginHero />

      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-slate-50 to-accent-50 px-4 py-12">
        {/* Acentos decorativos del lado del formulario */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 animate-blob-slow rounded-full bg-brand-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 animate-blob-slower rounded-full bg-accent-300/40 blur-3xl" />

        <div className="animate-fade-in-up relative w-full max-w-sm overflow-hidden rounded-3xl border border-white bg-white/95 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-sm">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-500 via-sky-500 to-accent-500" />

          <div className="mb-2 flex justify-center md:hidden">
            <BrandMark size="lg" />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-2xl font-semibold text-slate-900">Bienvenido de nuevo</h1>
            <p className="mt-1 text-sm text-slate-500">Ingresa con tu cuenta para continuar.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 space-y-4">
            <TextField
              label="Email"
              type="email"
              icon={Mail}
              autoFocus
              registration={register('email')}
              error={errors.email?.message}
            />
            <TextField
              label="Contraseña"
              type="password"
              icon={Lock}
              registration={register('password')}
              error={errors.password?.message}
            />

            {serverError && (
              <p role="alert" className="text-sm text-red-600">
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 shadow-lg shadow-brand-700/25 hover:from-brand-700 hover:to-accent-700"
            >
              <LogIn size={16} strokeWidth={2.25} />
              {isSubmitting ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
