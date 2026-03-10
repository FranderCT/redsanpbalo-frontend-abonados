import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { useUpdateMaterial } from "../Hooks/MaterialHooks";
import type { Material } from "../Models/Material";
import { UpdateMaterialSchema } from "../schemas/Materials/MaterialSchema";

type Props = {
  material: Material;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const UpdateMaterialModal = ({ material, open, onClose, onSuccess }: Props) => {
  const updateMaterialModalMutation = useUpdateMaterial();

  const form = useForm({
    validators: {
      onChange: UpdateMaterialSchema,
    },
    defaultValues: {
      Name: material.Name ?? "",
      IsActive: material.IsActive ?? true,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateMaterialModalMutation.mutateAsync({
          id: material.Id,
          data: {
            Name: value.Name.trim(),
            IsActive: value.IsActive,
          },
        });

        toast.success("¡Material actualizado!", {
          position: "top-right",
          autoClose: 3000,
        });

        formApi.reset(value);
        onClose();
        onSuccess?.();
      } catch (err) {
        console.error("Error al actualizar el material", err);
        toast.error("Error al actualizar el material", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  const handleDialogChange = (isOpen: boolean) => {
    if (isOpen) {
      form.reset({
        Name: material.Name ?? "",
        IsActive: material.IsActive ?? true,
      });
      return;
    }

    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-[#091540]">Editar material</DialogTitle>
          <DialogDescription>
            Actualiza la información y el estado del material seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 px-6">
          <Badge variant="outline">ID #{material.Id}</Badge>
          <Badge variant={material.IsActive ? "default" : "destructive"}>
            {material.IsActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4 px-6 pb-6"
        >
          <div className="flex max-h-[55vh] flex-col gap-2 overflow-y-auto">
            <FieldGroup>
              <form.Field
                name="Name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Ej. Acero"
                      />
                      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                    </Field>
                  );
                }}
              />
            </FieldGroup>

            <FieldGroup>
              <form.Field
                name="IsActive"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Estado</FieldLabel>
                    <label className="flex items-center gap-3 rounded-md border border-input px-3 py-2">
                      <input
                        id={field.name}
                        name={field.name}
                        type="checkbox"
                        checked={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm text-foreground">
                        {field.state.value ? "Material activo" : "Material inactivo"}
                      </span>
                    </label>
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <DialogFooter className="w-full justify-between sm:justify-between sm:space-x-0">
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar cambios"}
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                      Cancelar
                    </Button>
                  </DialogClose>
                </div>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMaterialModal;
