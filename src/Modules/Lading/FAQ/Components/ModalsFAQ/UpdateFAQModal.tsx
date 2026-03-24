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
import { useUpdateFAQ } from "../../Hooks/FAQHooks";
import type { FAQ } from "../../Models/FAQ";
import { UpdateFAQSchema } from "../../schemas/FAQSchema";

type Props = {
  faq: FAQ;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function UpdateFAQModal({ faq, open, onClose, onSuccess }: Props) {
  const updateFAQMutation = useUpdateFAQ();

  const form = useForm({
    defaultValues: {
      Question: faq.Question ?? "",
      Answer: faq.Answer ?? "",
      IsActive: faq.IsActive ?? true,
    },
    validators: {
      onChange: UpdateFAQSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateFAQMutation.mutateAsync({
          id: faq.Id,
          data: value,
        });
        toast.success("¡FAQ actualizada!", { position: "top-right", duration: 3000 });
        formApi.reset();
        onClose();
        onSuccess?.();
      } catch (err) {
        console.error("Error al actualizar FAQ", err);
        toast.error("Error al actualizar la FAQ", { position: "top-right", duration: 3000 });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[85vh] max-w-xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Editar FAQ</DialogTitle>
          <DialogDescription>
            Modifique el contenido y el estado de la pregunta frecuente.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-faq-form"
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
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Pregunta</dt>
                    <dd className="mt-1 text-sm text-foreground break-words">{faq.Question || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Respuesta</dt>
                    <dd className="mt-1 text-sm text-foreground break-words">{faq.Answer || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Estado</dt>
                    <dd className="mt-1 text-sm text-foreground">{faq.IsActive ? "Activo" : "Inactivo"}</dd>
                  </div>
                </CardContent>
              </Card>

              <FieldGroup className="gap-4">
                <form.Field name="Question">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Pregunta</FieldLabel>
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

                <form.Field name="Answer">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Respuesta</FieldLabel>
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
                    form="edit-faq-form"
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
