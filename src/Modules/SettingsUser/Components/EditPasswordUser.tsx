import React from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import ConfirmActionModal from "../../../Components/Modals/ConfirmActionModal";
import { ChangePasswordSchema } from "../../Auth/schemas/ChangePasswordSchema";
import { changePasswordInitialState } from "../../Auth/Models/changePassword";
import { useChangePassword } from "../../Auth/Hooks/AuthHooks";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { disconnectAppSocket } from "@/Sockets/appSocket";

type EditPayload = typeof changePasswordInitialState;

const formatErrors = (errors: unknown[]) =>
  errors?.map((e) =>
    typeof e === "object" && e !== null && "message" in e
      ? { message: (e as { message: string }).message }
      : { message: String(e) }
  );

const ChangePassword = () => {
  const changePasswdMutation = useChangePassword();
  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const pendingValuesRef = React.useRef<EditPayload | null>(null);

  const form = useForm({
    defaultValues: changePasswordInitialState,
    validators: { onChange: ChangePasswordSchema },
    onSubmit: async ({ value }) => {
      if (value.NewPassword !== value.ConfirmPassword) {
        toast.error("Las contraseñas no coinciden", {
          position: "top-right",
          duration: 3000,
        });
        return;
      }
      const NewPasswordObject = {
        OldPassword: value.OldPassword,
        NewPassword: value.NewPassword,
      };
      pendingValuesRef.current = NewPasswordObject as EditPayload;
      setOpenConfirm(true);
    },
  });

  const handleConfirmUpdate = async () => {
    if (!pendingValuesRef.current) return;
    try {
      await changePasswdMutation.mutateAsync({
        payload: pendingValuesRef.current,
        token: localStorage.getItem("token") || "",
      });

      toast.success("¡Contraseña actualizada con éxito!", {
        position: "top-right",
        duration: 2500,
      });

      disconnectAppSocket();
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      toast.info(
        "Tu sesión ha finalizado. Inicia sesión con tu nueva contraseña.",
        {
          position: "top-right",
          duration: 3500,
        }
      );

      form.reset();
    } catch {
      toast.error("¡Error al actualizar la contraseña!", {
        position: "top-right",
        duration: 3000,
      });
    } finally {
      setOpenConfirm(false);
      pendingValuesRef.current = null;
    }
  };

  const handleCancelUpdate = () => {
    setOpenConfirm(false);
    pendingValuesRef.current = null;
    toast.info("Actualización cancelada", {
      position: "top-right",
      duration: 3000,
    });
  };

  const PasswordField = form.Field;

  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-3 sm:p-6 overflow-x-hidden">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-lg sm:text-2xl text-[#091540]">
            Editar información de usuario
          </CardTitle>
          <CardDescription className="text-[#091540]/70">
            Modifique aquí la contraseña de su cuenta
          </CardDescription>
        </CardHeader>

        <form
          id="edit-password-user-form"
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <CardContent className="flex flex-col gap-4 pt-0">
            <FieldGroup className="gap-4">
              <PasswordField name="OldPassword">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor={field.name}>
                        Contraseña actual
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Ingrese su contraseña actual"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={formatErrors(field.state.meta.errors)}
                        />
                      )}
                    </Field>
                  );
                }}
              </PasswordField>

              <PasswordField name="NewPassword">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor={field.name}>
                        Nueva contraseña
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Ingrese su nueva contraseña"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={formatErrors(field.state.meta.errors)}
                        />
                      )}
                    </Field>
                  );
                }}
              </PasswordField>

              <PasswordField name="ConfirmPassword">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor={field.name}>
                        Confirmar nueva contraseña
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Confirme su nueva contraseña"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={formatErrors(field.state.meta.errors)}
                        />
                      )}
                    </Field>
                  );
                }}
              </PasswordField>
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex flex-row flex-wrap items-center justify-end gap-2 pt-0">
            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting, s.isDirty]}
            >
              {([canSubmit, isSubmitting, isDirty]) => (
                <div className="flex w-full flex-col-reverse items-center justify-end gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => navigate({ to: "/dashboard/users/profile" })}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    form="edit-password-user-form"
                    disabled={
                      !canSubmit || !isDirty || changePasswdMutation.isPending
                    }
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting || changePasswdMutation.isPending
                      ? "Guardando..."
                      : "Confirmar"}
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </CardFooter>
        </form>
      </Card>

      {openConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={handleCancelUpdate}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ConfirmActionModal
              description="¿Deseas actualizar tu contraseña? Su sesión finalizará una vez realice esta acción."
              confirmLabel="Confirmar"
              cancelLabel="Cancelar"
              onConfirm={handleConfirmUpdate}
              onCancel={handleCancelUpdate}
              onClose={handleCancelUpdate}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ChangePassword;
