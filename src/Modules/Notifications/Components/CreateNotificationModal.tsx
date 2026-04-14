import { useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { BellPlus, LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { useGetAllRoles } from "@/Modules/Users/Hooks/UsersHooks";
import { Role } from "@/Modules/Users/Models/Roles";
import { useCreateNotification } from "../Hooks/NotificationHooks";
import { createNotificationValidators } from "../schemas/CreateNotificationSchema";
import {
  ALL_ROLES_OPTION_NAME,
  type Notification,
  type NotificationApiResponse,
} from "../Types/Notification";


type CreateNotificationModalProps = {
  onCreate: (notification: Notification) => void;
};

const notificationInitialState = {
  subject: "",
  description: "",
  userRole: "",
};

const fallbackRoles = Object.values(Role).map((roleName, index) => ({
  Id: index + 1,
  Rolname: roleName,
}));

export default function CreateNotificationModal({
  onCreate,
}: CreateNotificationModalProps) {
  const [open, setOpen] = useState(false);
  const { roles = [], isLoading } = useGetAllRoles();
  const createNotificationMutation = useCreateNotification();

  const availableRoles = useMemo(() => {
    const resolvedRoles = roles.length > 0 ? roles : fallbackRoles;
    return [
      { Id: 0, Rolname: ALL_ROLES_OPTION_NAME },
      ...resolvedRoles,
    ];
  }, [roles]);

  const form = useForm({
    defaultValues: notificationInitialState,
    validators: {
      onChange: createNotificationValidators,
      onSubmit: createNotificationValidators,
    },
    onSubmit: async ({ value, formApi }) => {
      const selectedRole = availableRoles.find((role) => role.Rolname === value.userRole);

      if (!selectedRole) {
        toast.error("Debe seleccionar un rol valido");
        return;
      }

      const response = await createNotificationMutation.mutateAsync({
        Subject: value.subject.trim(),
        Message: value.description.trim(),
        User_Role: selectedRole.Rolname,
      });

      onCreate(
        mapNotificationResponse(
          response,
          selectedRole.Rolname
        )
      );
      toast.success("Notificacion creada correctamente");
      formApi.reset();
      setOpen(false);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          className="h-10 rounded-none bg-[#091540] px-5 text-sm text-white hover:bg-[#091540]/95"
        >
          <Plus className="size-4" />
          Crear Notificacion
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden rounded-none border-slate-200 bg-white p-0 sm:rounded-none">
        <DialogHeader className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-none bg-[#091540] text-white">
              <BellPlus className="size-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl text-[#091540]">Crear notificacion</DialogTitle>
              <DialogDescription className="text-slate-500">
                Complete los datos para enviar la notificacion a un rol especifico o a todos.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          id="create-notification-form"
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4 px-6 py-5">
            <FieldGroup className="gap-4">
              <form.Field name="subject">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor={field.name}>Asunto</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Asunto de la notificacion"
                        className="h-11 rounded-none border-slate-300"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="description">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor={field.name}>Descripcion</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Descripcion de la notificacion"
                        className="min-h-28 resize-none rounded-none border-slate-300"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="userRole">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor="notification-role">Rol destinatario</FieldLabel>
                      <Select
                        value={field.state.value || undefined}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger
                          id="notification-role"
                          className="h-11 rounded-none border-slate-300"
                          aria-invalid={isInvalid}
                        >
                          <SelectValue
                            placeholder={
                              isLoading ? "Cargando roles..." : "Seleccione un rol"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-slate-200">
                          {availableRoles.map((role) => (
                            <SelectItem key={role.Id} value={role.Rolname} className="rounded-none">
                              {role.Rolname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </div>

          <DialogFooter className="border-t border-slate-200 px-6 py-4">
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full rounded-none sm:w-auto">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    form="create-notification-form"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full rounded-none bg-[#091540] text-white hover:bg-[#091540]/95 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      "Crear notificacion"
                    )}
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function mapNotificationResponse(
  response: NotificationApiResponse,
  targetRoleName: string
): Notification {
  return {
    id: String(response.id ?? response.Id ?? crypto.randomUUID()),
    subject: response.subject ?? response.Subject ?? "",
    description: response.description ?? response.Description ?? response.message ?? response.Message ?? "",
    date: response.date ?? response.Date ?? new Date().toISOString(),
    status: response.status ?? response.Status ?? "UNREAD",
    targetRoleName,
  };
}
