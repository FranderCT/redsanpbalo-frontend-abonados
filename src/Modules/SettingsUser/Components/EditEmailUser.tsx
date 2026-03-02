import React from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useUpdateUserEmail } from "../../Users/Hooks/UsersHooks";
import { EmailUserInitialState } from "../Models/EmailUser";
import { EditEmailUserSchema } from "../schemas/EditEmailUserSchema";
import ConfirmActionModal from "../../../Components/Modals/ConfirmActionModal";
import { toast } from "react-toastify";
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

type EditPayload = typeof EmailUserInitialState;

const formatErrors = (errors: unknown[]) =>
  errors?.map((e) =>
    typeof e === "object" && e !== null && "message" in e
      ? { message: (e as { message: string }).message }
      : { message: String(e) }
  );

const EditEmailUser = () => {
  const updateProfile = useUpdateUserEmail();
  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const pendingValuesRef = React.useRef<EditPayload | null>(null);

  const form = useForm({
    defaultValues: EmailUserInitialState,
    validators: { onChange: EditEmailUserSchema },
    onSubmit: async ({ value }) => {
      pendingValuesRef.current = value as EditPayload;
      setOpenConfirm(true);
    },
  });

  const handleConfirmUpdate = async () => {
    if (!pendingValuesRef.current) return;
    try {
      await updateProfile.mutateAsync(pendingValuesRef.current);
      toast.success("¡Actualización exitosa!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate({ to: "/dashboard/users/profile" });
    } catch {
      toast.error("¡Error al actualizar el correo!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setOpenConfirm(false);
      pendingValuesRef.current = null;
    }
  };

  const handleCancelUpdate = () => {
    toast.info("¡Actualización cancelada!", {
      position: "top-right",
      autoClose: 3000,
    });
    setOpenConfirm(false);
    pendingValuesRef.current = null;
  };

  const EmailField = form.Field;

  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-3 sm:p-6 overflow-x-hidden">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-lg sm:text-2xl text-[#091540]">
            Editar información de usuario
          </CardTitle>
          <CardDescription className="text-[#091540]/70">
            Modifique aquí su correo electrónico
          </CardDescription>
        </CardHeader>

        <form
          id="edit-email-user-form"
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <CardContent className="flex flex-col gap-4 pt-0">
          <FieldGroup className="gap-4">
            <EmailField name="OldEmail">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="gap-2">
                    <FieldLabel htmlFor={field.name}>
                      Correo electrónico actual
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Ej: usuario@ejemplo.com"
                    />
                    {isInvalid && (
                      <FieldError
                        errors={formatErrors(field.state.meta.errors)}
                      />
                    )}
                  </Field>
                );
              }}
            </EmailField>

            <EmailField name="NewEmail">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="gap-2">
                    <FieldLabel htmlFor={field.name}>
                      Correo electrónico nuevo
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Ej: nuevo@ejemplo.com"
                    />
                    {isInvalid && (
                      <FieldError
                        errors={formatErrors(field.state.meta.errors)}
                      />
                    )}
                  </Field>
                );
              }}
            </EmailField>
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
                    form="edit-email-user-form"
                    disabled={
                      !canSubmit || !isDirty || updateProfile.isPending
                    }
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting || updateProfile.isPending
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
              description={
                pendingValuesRef.current
                  ? `Se actualizará tu correo de "${pendingValuesRef.current.OldEmail}" a "${pendingValuesRef.current.NewEmail}".`
                  : "Se actualizará tu correo."
              }
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

export default EditEmailUser;
