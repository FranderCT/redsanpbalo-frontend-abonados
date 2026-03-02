import { useEffect } from "react";
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
} from "@/Components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { useUpdateReportLocation } from "../../Hooks/ReportLocationHooks";
import type { ReportLocation } from "../../Models/ReportLocation";
import { updateReportLocationValidators } from "../../schemas/ReportLocationSchema";

interface EditReportLocationModalProps {
  reportLocation: ReportLocation;
  open: boolean;
  onClose: () => void;
}

export default function EditReportLocationModal({
  reportLocation,
  open,
  onClose,
}: EditReportLocationModalProps) {
  const updateMutation = useUpdateReportLocation();

  const form = useForm({
    defaultValues: {
      Neighborhood: reportLocation.Neighborhood || "",
    },
    validators: {
      onChange: updateReportLocationValidators,
      onSubmit: updateReportLocationValidators,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync({
          id: reportLocation.Id,
          payload: { Neighborhood: value.Neighborhood.trim().toUpperCase() },
        });
        toast.success("¡Ubicación actualizada exitosamente!");
        form.reset();
        onClose();
      } catch {
        // showApiErrorToast en hook
      }
    },
  });

  useEffect(() => {
    if (open && reportLocation) {
      form.setFieldValue("Neighborhood", reportLocation.Neighborhood || "");
    }
  }, [open, reportLocation]);

  const formatErrors = (errors: unknown[]) =>
    errors?.map((e) =>
      typeof e === "object" && e !== null && "message" in e
        ? { message: (e as { message: string }).message }
        : { message: String(e) }
    );

  const LocationField = form.Field;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          form.reset();
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Editar ubicación #{reportLocation.Id}</DialogTitle>
          <DialogDescription>
            Modifique el nombre del barrio o zona.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-report-location-form"
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
                        <FieldError
                          errors={formatErrors(field.state.meta.errors)}
                        />
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
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    form="edit-report-location-form"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Actualizando..." : "Actualizar ubicación"}
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
