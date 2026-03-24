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
import { useCreateFAQ } from "../../Hooks/FAQHooks";
import { CreateFAQSchema } from "../../schemas/FAQSchema";

export default function CreateFAQModal() {
  const [open, setOpen] = useState(false);
  const createFAQMutation = useCreateFAQ();

  const form = useForm({
    defaultValues: {
      Question: "",
      Answer: "",
    },
    validators: {
      onChange: CreateFAQSchema,
      onSubmit: CreateFAQSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createFAQMutation.mutateAsync(value);
        toast.success("¡FAQ creada exitosamente!", { position: "top-right", duration: 3000 });
        setOpen(false);
        form.reset();
      } catch (err) {
        console.error("Error creando FAQ:", err);
        toast.error("Error al crear la FAQ", { position: "top-right", duration: 3000 });
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
        <Button className="w-full sm:w-auto">+ Añadir FAQ</Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[85vh] max-w-xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Crear pregunta frecuente</DialogTitle>
          <DialogDescription>
            Complete los datos para registrar una nueva FAQ.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-faq-form"
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
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
                        autoFocus
                        placeholder="Escriba la pregunta"
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
                        placeholder="Escriba la respuesta"
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
                    form="create-faq-form"
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
