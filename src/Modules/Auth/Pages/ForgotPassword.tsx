import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, MailCheck } from "lucide-react";
import { useState } from "react";
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
import { useForgotPasswd } from "../Hooks/AuthHooks";
import { ForgotPasswordInitialState } from "../Models/ForgotPassword";
import { ForgotPasswordSchema } from "../schemas/ForgotPasswordSchema";

const ForgotPassword = () => {
  const forgotPasswordMutation = useForgotPasswd();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    defaultValues: ForgotPasswordInitialState,
    validators: {
      onChange: ForgotPasswordSchema,
      onSubmit: ForgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await forgotPasswordMutation.mutateAsync(value);
        setIsSuccess(true);
        toast.success("Se envió el correo de recuperación");
        form.reset();
      } catch (error) {
        console.error("Error al enviar recuperación de contraseña", error);
        toast.error("No se pudo enviar el correo de recuperación");
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
            Olvidó su contraseña
          </CardTitle>
          <p className="text-center text-sm text-slate-600 mt-2">
            Ingrese su cédula y correo para enviar el enlace de recuperación.
          </p>
        </CardHeader>

        {isSuccess ? (
          <>
            <CardContent className="pt-2">
              <div className="flex flex-col items-center gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <MailCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-emerald-700">
                    El correo para restablecer la contraseña ha sido enviado.
                  </p>
                  <p className="text-sm text-slate-700">
                    Revise su bandeja de entrada y siga las instrucciones.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3 pt-2 pb-6">
              <Button asChild className="w-full h-10 font-semibold bg-blue-700 hover:bg-blue-800">
                <Link to="/login">Volver a iniciar sesión</Link>
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardContent className="pt-2">
              <form
                id="forgot-password-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="space-y-5"
              >
                <FieldGroup className="gap-4">
                  <form.Field name="IDcard">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="gap-2">
                          <FieldLabel htmlFor="idcard">Cédula</FieldLabel>
                          <Input
                            id="idcard"
                            type="text"
                            placeholder="Ingresa tu cédula"
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

                  <form.Field name="Email">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
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
                    form="forgot-password-form"
                    className="w-full h-10 font-semibold bg-blue-700 hover:bg-blue-800"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar correo"}
                  </Button>
                )}
              </form.Subscribe>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
