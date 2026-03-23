import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
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
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Activity,
  BadgeCheck,
  BellRing,
  Droplets,
  FileText,
  MessageCircle,
  Phone,
  Wrench,
  Zap,
} from "lucide-react";
import { useCreateService } from "../../Hooks/ServicesHooks";
import { CreateServiceSchema } from "../../schemas/ServiceSchema";

const ICON_OPTIONS = [
  { value: "activity", label: "Actividad", Icon: Activity },
  { value: "badge-check", label: "Verificado", Icon: BadgeCheck },
  { value: "bell-ring", label: "Notificación", Icon: BellRing },
  { value: "message-circle", label: "Mensaje", Icon: MessageCircle },
  { value: "zap", label: "Energía", Icon: Zap },
  { value: "droplets", label: "Agua", Icon: Droplets },
  { value: "wrench", label: "Herramientas", Icon: Wrench },
  { value: "file-text", label: "Documento", Icon: FileText },
  { value: "phone", label: "Teléfono", Icon: Phone },
];

export default function CreateServiceModal() {
  const [open, setOpen] = useState(false);
  const createServiceMutation = useCreateService();

  const form = useForm({
    defaultValues: {
      Icon: "",
      Title: "",
      Description: "",
    },
    validators: {
      onChange: CreateServiceSchema,
      onSubmit: CreateServiceSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createServiceMutation.mutateAsync(value);
        toast.success("¡Servicio creado exitosamente!", { position: "top-right", duration: 3000 });
        setOpen(false);
        form.reset();
      } catch (err) {
        console.error("Error creando servicio:", err);
        toast.error("Error al crear el servicio", { position: "top-right", duration: 3000 });
      }
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">+ Añadir Servicio</Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[85vh] max-w-xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Crear servicio</DialogTitle>
          <DialogDescription>
            Complete los datos para registrar un nuevo servicio para la landing.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-service-form"
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
            <FieldGroup className="gap-4">
              <form.Field name="Icon">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  const selectedIcon = ICON_OPTIONS.find((option) => option.value === field.state.value);
                  const IconComponent = selectedIcon?.Icon;

                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel>Icono del servicio</FieldLabel>
                      <Select value={field.state.value} onValueChange={field.handleChange}>
                        <SelectTrigger aria-invalid={isInvalid}>
                          <SelectValue placeholder="Seleccione un icono" />
                        </SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedIcon && IconComponent ? (
                        <div className="flex items-center gap-3 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                          <IconComponent className="h-5 w-5 text-[#1789FC]" />
                          <span>{selectedIcon.label}</span>
                        </div>
                      ) : null}
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="Title">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor={field.name}>Título</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Escriba el título"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="Description">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor={field.name}>Descripción</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        placeholder="Escriba la descripción del servicio"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="min-h-[140px] resize-none"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </div>

          <DialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="flex w-full gap-2 flex-col-reverse items-center justify-between sm:flex-row-reverse">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    form="create-service-form"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Registrando…" : "Registrar"}
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
