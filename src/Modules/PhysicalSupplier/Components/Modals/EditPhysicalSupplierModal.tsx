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
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import { Textarea } from "@/Components/ui/textarea";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { useEditPhysicalSupplier } from "../../Hooks/PhysicalSupplierHooks";
import type { PhysicalSupplier } from "../../Models/PhysicalSupplier";
import { UpdatePhysicalSupplierSchema } from "../../Schemas/UpdatePhysicalSupplierSchema";

type Props = {
  supplier: PhysicalSupplier;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function EditPhysicalSupplierModal({
  supplier: physicalSupplier,
  open,
  onClose,
  onSuccess,
}: Props) {
  const supplier = physicalSupplier.Supplier;
  const updateMutation = useEditPhysicalSupplier();

  const form = useForm({
    defaultValues: {
      IDcard: supplier?.IDcard ?? "",
      Name: supplier?.Name ?? "",
      Surname1: physicalSupplier.Surname1 ?? "",
      Surname2: physicalSupplier.Surname2 ?? "",
      Email: supplier?.Email ?? "",
      PhoneNumber: supplier?.PhoneNumber ?? "",
      Location: supplier?.Location ?? "",
      IsActive: supplier?.IsActive ?? true,
    },
    validators: { onChange: UpdatePhysicalSupplierSchema },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync({
          id: physicalSupplier.Id,
          data: value,
        });
        form.reset();
        onSuccess?.();
        onClose();
      } catch (err) {
        console.error(err);
      }
    },
  });

  useEffect(() => {
    if (!open || !supplier) return;
    form.setFieldValue("IDcard", supplier.IDcard ?? "");
    form.setFieldValue("Name", supplier.Name ?? "");
    form.setFieldValue("Surname1", physicalSupplier.Surname1 ?? "");
    form.setFieldValue("Surname2", physicalSupplier.Surname2 ?? "");
    form.setFieldValue("Email", supplier.Email ?? "");
    form.setFieldValue("PhoneNumber", supplier.PhoneNumber ?? "");
    form.setFieldValue("Location", supplier.Location ?? "");
    form.setFieldValue("IsActive", supplier.IsActive ?? true);
  }, [physicalSupplier, supplier, open]);

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="flex max-h-[70vh] max-w-xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Editar proveedor físico</DialogTitle>
          <DialogDescription>
            Actualice la información del proveedor.
          </DialogDescription>
        </DialogHeader>
        <form
          id="edit-physical-supplier-form"
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
            <div className="flex flex-col gap-4">
            <FieldGroup className="gap-4">
              <FieldGroup className="gap-2">
                <form.Field name="IDcard">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Número de cédula</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Ej: 504440123"
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
              </FieldGroup>

              <FieldGroup className="gap-2">
                <form.Field name="Name">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Nombre"
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
              </FieldGroup>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <form.Field name="Surname1">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Primer apellido</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Primer apellido"
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
                <form.Field name="Surname2">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Segundo apellido</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Segundo apellido"
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
              </div>

              <FieldGroup className="gap-2">
                <form.Field name="Email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Correo electrónico</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          placeholder="proveedor@ejemplo.com"
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
              </FieldGroup>

              <FieldGroup className="gap-2">
                <form.Field name="PhoneNumber">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <PhoneField
                          label="Teléfono"
                          value={field.state.value}
                          onChange={(val) => field.handleChange(val ?? "")}
                          defaultCountry="CR"
                          required
                          data-invalid={isInvalid}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              <FieldGroup className="gap-2">
                <form.Field name="Location">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Dirección</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Dirección del proveedor"
                          rows={4}
                          className="min-h-[80px] resize-y"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              <form.Field name="IsActive">
                {(field) => (
                  <Field className="gap-2">
                    <label className="flex cursor-pointer select-none items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className="h-4 w-4 rounded border-input"
                      />
                      <FieldLabel className="cursor-pointer font-medium">
                        Proveedor activo
                      </FieldLabel>
                    </label>
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
            </div>
          </div>
          <DialogFooter className="shrink-0 flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="flex w-full flex-col-reverse items-center justify-between gap-2 sm:flex-row-reverse">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={handleClose}
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    form="edit-physical-supplier-form"
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
