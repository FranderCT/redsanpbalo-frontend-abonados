import { useForm } from '@tanstack/react-form'
import { AuthInitialState } from '../Models/Auth';
import { useLogin } from '../Hooks/AuthHooks';
import { AuthSchema } from '../schemas/AuthSchemas';
import { toast } from 'react-toastify';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { ChevronLeft } from 'lucide-react';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/Components/ui/field';

const LoginUser = () => {
  const loginMutation = useLogin();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: AuthInitialState,
    validators: { onChange: AuthSchema },
    onSubmit: async ({ value }) => {
        try {
            await loginMutation.mutateAsync(value);
            toast.success('¡Acceso exitoso!', { position: 'top-right', autoClose: 3000 });
            navigate({ to: '/dashboard' });
            form.reset();
        }   catch {
            toast.error('¡Acceso Denegado!', { position: 'top-right', autoClose: 3000 });
            form.reset();
        }
    }
  });

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 p-4">
      <Card className="w-full max-w-sm rounded-xl shadow-lg border border-slate-200">
        <CardHeader className="relative pb-3">
          {/* Botón volver (arriba izquierda) */}
          <div className="flex absolute top-3 left-3">
            <Link
              to="/"
              className="hover:underline underline-offset-4 inline-flex items-center gap-2 text-xs px-3 py-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Volver</span>
            </Link>
          </div>
          {/* Logo centrado */}
          <div className="mt-8 flex justify-center items-center">
            <img
              src="src\assets\images\LogoRedSanPabloHG.png"
              alt="Logo ASADA"
              className="h-15 w-auto object-contain"
            />
          </div>

          {/* Título centrado y más grande */}
          <CardTitle className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Iniciar sesión
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-2">
          <form
            id="login-form"
            onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
            className="space-y-5"
          >
            <FieldGroup className="gap-4">
              <form.Field name="Email">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor="email">
                        Correo electrónico
                      </FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="h-10"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="Password">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor="password">
                        Contraseña
                      </FieldLabel>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="h-10"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-3 pt-2 pb-6">
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                form="login-form"
                className="w-full h-10 font-semibold bg-blue-700 hover:bg-blue-800"
                disabled={!canSubmit}
              >
                {isSubmitting ? "..." : "Iniciar sesión"}
              </Button>
            )}
          </form.Subscribe>

          {/* Links abajo en fila como la imagen */}
          <div className="flex w-full items-center justify-between text-sm">
            <Link
              to="/forgot-password"
              className="hover:underline underline-offset-4"
            >
              ¿Olvidó su contraseña?
            </Link>

            <Link
              to="/register"
              className="hover:underline underline-offset-4"
            >
              Registrarse
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginUser;
