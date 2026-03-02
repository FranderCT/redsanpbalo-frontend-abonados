import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
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
import { MapPin } from "lucide-react";
import { useCreateReportLocation } from "../../Hooks/ReportLocationHooks";
import { createReportLocationValidators } from "../../schemas/ReportLocationSchema";

const defaultValues = {
  Neighborhood: "",
};

export default function CreateReportLocationModal() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateReportLocation();

  const form = useForm({
    defaultValues,
    validators: {
      onChange: createReportLocationValidators,
      onSubmit: createReportLocationValidators,
    },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({
          Neighborhood: value.Neighborhood.trim().toUpperCase(),
        });
        toast.success("¡Ubicación creada exitosamente!");
        form.reset();
        setOpen(false);
      } catch {
        // showApiErrorToast en hook
      }
    },
  });

  const LocationField = form.Field;

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
          <MapPin className="size-4" />
          Crear ubicación
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Crear nueva ubicación (barrio)</DialogTitle>
          <DialogDescription>
            Registre un barrio o zona para asociar a los reportes.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-report-location-form"
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-2 px-6 py-4">
            <FieldGroup className="gap-4">
              <LocationField
                name="Neighborhood"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor={field.name}>Barrio / Zona</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Ej: San Pablo, Centro..."
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
                    form="create-report-location-form"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Creando..." : "Crear ubicación"}
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
