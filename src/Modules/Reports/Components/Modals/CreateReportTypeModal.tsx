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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Tags } from "lucide-react";
import { useCreateReportType } from "../../Hooks/ReportTypesHooks";
import { createReportTypeValidators } from "../../schemas/ReportTypeSchema";

const defaultValues = {
  Name: "",
};

export default function CreateReportTypeModal() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateReportType();

  const form = useForm({
    defaultValues,
    validators: {
      onChange: createReportTypeValidators,
      onSubmit: createReportTypeValidators,
    },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({
          Name: value.Name.trim().toUpperCase(),
        });
        toast.success("¡Tipo de reporte creado exitosamente!");
        form.reset();
        setOpen(false);
      } catch {
        // showApiErrorToast en hook
      }
    },
  });

  const TypeField = form.Field;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Tags className="size-4" />
          Crear tipo
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[70vh] gap-0 overflow-hidden">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Crear nuevo tipo de reporte</DialogTitle>
          <DialogDescription>
            Registre un tipo para clasificar los reportes.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-report-type-form"
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-2 px-6 py-4">
            <FieldGroup className="gap-4">
              <TypeField
                name="Name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor={field.name}>Tipo de reporte</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Ej: Fuga, Daño, Reconexión..."
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </div>

          <DialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <div className="flex w-full flex-col-reverse items-center justify-between sm:flex-row-reverse">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    form="create-report-type-form"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Creando..." : "Crear tipo"}
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
