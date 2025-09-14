import { useForm } from '@tanstack/react-form';
import { ForgotPasswordInitialState } from '../Models/ForgotPassword';
import { useForgotPasswd } from '../Hooks/AuthHooks';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ForgotPasswordSchema } from '../schemas/ForgotPasswordSchema';

const ForgotPassword = () => {
  const useForgotPasswdMutation = useForgotPasswd();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    defaultValues: ForgotPasswordInitialState,
    validators: {
      onChange: ForgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await useForgotPasswdMutation.mutateAsync(value);
        setIsSuccess(true); // <-- cambia a vista de éxito
      } catch (err) {
        console.error('Error al enviar', err);
      }
    },
  });

  return (
    <div className="w-full h-screen bg-[#f1f1f1] flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border-t-8 border-[#091540] px-8 py-10 relative">
        <div className="flex flex-col justify-center items-center gap-6">
          <h2 className="md:text-3xl font-semibold text-[#091540] text-center drop-shadow-lg">
            Olvidó su contraseña
          </h2>

          {isSuccess ? (
            // Vista de éxito
            <div className="flex flex-col items-center gap-4 p-6">
              <p className="text-[#68D89B] text-lg font-medium text-center">
                El correo para restablecer la contraseña ha sido enviado.
              </p>
              <p className="text-[#091540] text-center">
                Revise su bandeja de entrada y siga las instrucciones.
              </p>
              <Link
                to='/login'
                className="mt-4 text-sm md:text-lg text-[#3A7CA5] underline font-medium hover:text-[#091540]"
              >
                Volver a Iniciar sesión
              </Link>
            </div>
          ) : (
            // Formulario
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="w-full p-4 flex flex-col gap-6"
            >
              <form.Field name="IDcard">
                {(field) => (
                  <>
                    <input
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Cédula"
                      className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1789FC] focus:border-transparent"
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500 mt-1">
                          {(field.state.meta.errors[0] as any)?.message ??
                            String(field.state.meta.errors[0])}
                        </p>
                      )}
                  </>
                )}
              </form.Field>

              <form.Field name="Email">
                {(field) => (
                  <>
                    <input
                      className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1789FC] focus:border-transparent"
                      placeholder="Correo electrónico"
                      value={field.state.value}
                      type="email"
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500 mt-1">
                          {(field.state.meta.errors[0] as any)?.message ??
                            String(field.state.meta.errors[0])}
                        </p>
                      )}
                  </>
                )}
              </form.Field>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <div className="flex flex-row justify-end items-end">
                    <button
                      type="submit"
                      className="w-full md:w-1/3 px-6 py-3 bg-[#091540] shadow-xl text-white rounded-md font-semibold hover:bg-[#1789FC] transition cursor-pointer"
                      disabled={!canSubmit}
                    >
                      {isSubmitting ? '...' : 'Enviar'}
                    </button>
                  </div>
                )}
              </form.Subscribe>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
