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
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
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
import { useUpdateService } from "../../Hooks/ServicesHooks";
import type { Service } from "../../Models/Services";
import { UpdateServiceSchema } from "../../schemas/ServiceSchema";

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

type Props = {
  service: Service;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function UpdateServiceModal({ service, open, onClose, onSuccess }: Props) {
  const updateServiceMutation = useUpdateService();

  const form = useForm({
    defaultValues: {
      Icon: service.Icon ?? "",
      Title: service.Title ?? "",
      Description: service.Description ?? "",
      IsActive: service.IsActive ?? true,
    },
    validators: {
      onChange: UpdateServiceSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateServiceMutation.mutateAsync({
          id: service.Id,
          data: value,
        });
        toast.success("¡Servicio actualizado!", { position: "top-right", duration: 3000 });
        formApi.reset();
        onClose();
        onSuccess?.();
      } catch (err) {
        console.error("Error al actualizar servicio", err);
        toast.error("Error al actualizar el servicio", { position: "top-right", duration: 3000 });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[85vh] max-w-xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Editar servicio</DialogTitle>
          <DialogDescription>
            Modifique el contenido y el estado del servicio de la landing.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-service-form"
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Información actual</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 pt-0">
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Título</dt>
                    <dd className="mt-1 text-sm text-foreground break-words">{service.Title || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Descripción</dt>
                    <dd className="mt-1 text-sm text-foreground break-words">{service.Description || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Estado</dt>
                    <dd className="mt-1 text-sm text-foreground">{service.IsActive ? "Activo" : "Inactivo"}</dd>
                  </div>
                </CardContent>
              </Card>

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

                <form.Field name="IsActive">
                  {(field) => (
                    <Field className="gap-2">
                      <FieldLabel>Estado</FieldLabel>
                      <label className="flex cursor-pointer select-none items-center gap-3 text-sm text-foreground">
                        <span>{field.state.value ? "Activo" : "Inactivo"}</span>
                        <input
                          type="checkbox"
                          checked={!!field.state.value}
                          onChange={(e) => field.handleChange(e.target.checked)}
                          className="h-4 w-4 rounded border-input"
                        />
                      </label>
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )}
                </form.Field>
              </FieldGroup>
            </div>
          </div>

          <DialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="flex w-full flex-col-reverse items-center justify-between sm:flex-row-reverse">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    form="edit-service-form"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Guardando…" : "Guardar cambios"}
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
