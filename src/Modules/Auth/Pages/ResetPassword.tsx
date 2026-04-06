import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ChevronLeft, KeyRound } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { useResetPassword } from "../Hooks/AuthHooks";
import { ResetPasswordInitialState } from "../Models/ResetPassword";
import { ResetPasswordSchema } from "../schemas/ResetPasswordSchema";

const ResetPassword = () => {
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();
  const [isSuccess, setIsSuccess] = useState(false);

  const token = useMemo(
    () => new URLSearchParams(window.location.search).get("token") ?? "",
    []
  );

  const form = useForm({
    defaultValues: ResetPasswordInitialState,
    validators: {
      onChange: ResetPasswordSchema,
      onSubmit: ResetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("Token no encontrado en la URL");
        return;
      }

      try {
        await resetPasswordMutation.mutateAsync({ payload: value, token });
        setIsSuccess(true);
        toast.success("Contraseña restablecida correctamente");
        form.reset();
      } catch (error) {
        console.error("Error al restablecer contraseña", error);
        toast.error("No se pudo restablecer la contraseña");
      }
    },
  });

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border border-slate-200">
        <CardHeader className="relative pb-3">
          <div className="flex absolute top-3 left-3">
            <Link
              to="/login"
              className="hover:underline underline-offset-4 inline-flex items-center gap-2 text-xs px-3 py-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Volver</span>
            </Link>
          </div>

          <div className="mt-8 flex justify-center items-center">
            <img
              src="src\assets\images\LogoRedSanPabloHG.png"
              alt="Logo ASADA"
              className="h-15 w-auto object-contain"
            />
          </div>

          <CardTitle className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Restablecer contraseña
          </CardTitle>
          <p className="text-center text-sm text-slate-600 mt-2">
            Defina una nueva contraseña segura para su cuenta.
          </p>
        </CardHeader>

        {isSuccess ? (
          <>
            <CardContent className="pt-2">
              <div className="flex flex-col items-center gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-emerald-700">
                    Contraseña restablecida con éxito.
                  </p>
                  <p className="text-sm text-slate-700">
                    Ya puede iniciar sesión con su nueva contraseña.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3 pt-2 pb-6">
              <Button
                asChild
                className="w-full h-10 font-semibold bg-blue-700 hover:bg-blue-800"
              >
                <Link to="/login">Ir a iniciar sesión</Link>
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardContent className="pt-2">
              {!token && (
                <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  El enlace no contiene un token válido para restablecer la contraseña.
                </div>
              )}

              <form
                id="reset-password-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="space-y-5"
              >
                <FieldGroup className="gap-4">
                  <form.Field name="NewPassword">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="gap-2">
                          <FieldLabel htmlFor="new-password">
                            Nueva contraseña
                          </FieldLabel>
                          <Input
                            id="new-password"
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

                  <form.Field name="ConfirmPassword">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="gap-2">
                          <FieldLabel htmlFor="confirm-password">
                            Confirmar contraseña
                          </FieldLabel>
                          <Input
                            id="confirm-password"
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
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    form="reset-password-form"
                    className="w-full h-10 font-semibold bg-blue-700 hover:bg-blue-800"
                    disabled={!canSubmit || isSubmitting || !token}
                  >
                    {isSubmitting ? "Restableciendo..." : "Restablecer contraseña"}
                  </Button>
                )}
              </form.Subscribe>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10"
                onClick={() => navigate({ to: "/login" })}
              >
                <KeyRound className="h-4 w-4" />
                Cancelar
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
