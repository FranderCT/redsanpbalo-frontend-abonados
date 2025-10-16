import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { ResetPasswordInitialState } from "../Models/ResetPassword";
import { useResetPassword } from "../Hooks/AuthHooks";
import { useState } from "react";
import { ResetPasswordSchema } from "../schemas/ResetPasswordSchema";

const ResetPassword = () => {
  const navigate = useNavigate();
  const resetPasswdMutation = useResetPassword();
  const [isSuccess, setIsSuccess] = useState(false);

  // Leer ?token=... desde la URL
  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const form = useForm({
    defaultValues: ResetPasswordInitialState,
    validators: {
      onChange: ResetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (value.NewPassword !== value.ConfirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }
      if (!token) {
        alert("Token no encontrado en la URL");
        return;
      }

      try {
        await resetPasswdMutation.mutateAsync({ payload: value, token });
        form.reset();
        setIsSuccess(true); // <- mostrar vista de éxito
      } catch (err) {
        console.error(err);
        alert("No se pudo restablecer la contraseña. Intente nuevamente.");
      }
    },
  });

  return (
    <div className="w-full max-w-md bg-white rounded-sm shadow-lg border-t-20 border-[#091540] px-8 py-10">
      <div className="flex flex-col justify-center items-center flex-grow w-full gap-4">
        <h2 className="md:text-3xl font-bold text-[#091540] text-center drop-shadow-lg gap-4">
          Restablecer contraseña
        </h2>

        {isSuccess ? (
          // --- Vista de éxito ---
          <div className="flex flex-col items-center gap-3 p-4 text-center">
            <p className="text-[#68D89B] text-lg font-semibold">
              ¡Contraseña restablecida con éxito!
            </p>
            <p className="text-[#091540]">
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <button
              onClick={() => navigate({ to: "/login" })}
              className="w-1/2 bg-[#091540] shadow-xl text-white py-2 rounded-md font-semibold hover:bg-[#1789FC] transition cursor-pointer"
            >
              Ir a Iniciar sesión
            </button>
          </div>
        ) : (
          // --- Formulario ---
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="w-full max-w-md p-2 flex flex-col gap-6"
          >
            <form.Field name="NewPassword">
              {(field) => (
                <>
                  <input
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Nueva contraseña"
                    className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
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

            <form.Field name="ConfirmPassword">
              {(field) => (
                <>
                  <input
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Confirmar contraseña"
                    className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
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

            <div className="flex justify-center gap-4">
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    className="bg-[#68D89B] hover:bg-green-600 text-white font-semibold w-1/3 rounded disabled:opacity-60"
                    disabled={!canSubmit || isSubmitting || !token}
                  >
                    {isSubmitting ? "..." : "Restablecer"}
                  </button>
                )}
              </form.Subscribe>

              <button
                type="button"
                className="bg-[#F6132D] hover:bg-red-700 text-white font-semibold w-1/3 px-6 py-2 rounded"
                onClick={() => navigate({ to: "/login" })}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
