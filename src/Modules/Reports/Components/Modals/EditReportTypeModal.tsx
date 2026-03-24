import { useEffect } from "react";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useUpdateReportType } from "../../Hooks/ReportTypesHooks";
import type { ReportType } from "../../Models/ReportType";
import { updateReportTypeValidators } from "../../schemas/ReportTypeSchema";

interface EditReportTypeModalProps {
  reportType: ReportType;
  open: boolean;
  onClose: () => void;
}

export default function EditReportTypeModal({
  reportType,
  open,
  onClose,
}: EditReportTypeModalProps) {
  const updateMutation = useUpdateReportType();

  const form = useForm({
    defaultValues: {
      Name: reportType.Name || "",
      IsActive: reportType.IsActive ?? true,
    },
    validators: {
      onChange: updateReportTypeValidators,
      onSubmit: updateReportTypeValidators,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync({
          id: reportType.Id,
          payload: {
            Name: value.Name.trim().toUpperCase(),
            IsActive: value.IsActive,
          },
        });
        toast.success("¡Tipo de reporte actualizado exitosamente!");
        form.reset();
        onClose();
      } catch {
        // showApiErrorToast en hook
      }
    },
  });

  useEffect(() => {
    if (open && reportType) {
      form.setFieldValue("Name", reportType.Name || "");
      form.setFieldValue("IsActive", reportType.IsActive ?? true);
    }
  }, [open, reportType]);

  const formatErrors = (errors: unknown[]) =>
    errors?.map((e) =>
      typeof e === "object" && e !== null && "message" in e
        ? { message: (e as { message: string }).message }
        : { message: String(e) }
    );

  const TypeField = form.Field;

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
      <DialogContent className="max-h-[70vh] gap-0 overflow-hidden">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Editar tipo de reporte #{reportType.Id}</DialogTitle>
          <DialogDescription>
            Modifique el nombre del tipo de reporte.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-report-type-form"
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
                        <FieldError
                          errors={formatErrors(field.state.meta.errors)}
                        />
                      )}
                    </Field>
                  );
                }}
              />

              <TypeField
                name="IsActive"
                children={(field) => (
                  <Field className="gap-2">
                    <FieldLabel htmlFor={field.name}>Estado</FieldLabel>
                    <Select
                      value={field.state.value ? "active" : "inactive"}
                      onValueChange={(value) =>
                        field.handleChange(value === "active")
                      }
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
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
                    form="edit-report-type-form"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Actualizando..." : "Actualizar tipo"}
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
