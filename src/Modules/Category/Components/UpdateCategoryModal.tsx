import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { useUpdateCategory } from "../Hooks/CategoryHooks";
import type { Category } from "../Models/Category";
import { UpdateCategorySchema } from "../schemas/CategorySchema";
import { useState } from "react";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";

type Props = {
  category: Category;
};

const UpdateCategoryModal = ({ category }: Props) => {
  const updateCategoryModalMutation = useUpdateCategory();
  const [open, setOpen] = useState(false);

  const form = useForm({
    validators: {
      onChange: UpdateCategorySchema,
    },
    defaultValues: {
      Name: category?.Name ?? "",
      Description: category?.Description ?? "",
      IsActive: category?.IsActive ?? true,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateCategoryModalMutation.mutateAsync({
          id: category.Id,
          data: {
            Name: value.Name.trim(),
            Description: value.Description.trim(),
            IsActive: value.IsActive,
          },
        });

        toast.success("¡Categoría actualizada!", {
          position: "top-right",
          autoClose: 3000,
        });

        formApi.reset(value);
        setOpen(false);
      } catch (err) {
        console.error("error desconocido", err);
        toast.error("Error al actualizar la Categoría", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      form.reset({
        Name: category.Name ?? "",
        Description: category.Description ?? "",
        IsActive: category.IsActive ?? true,
      });
      return;
    }

    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <button type="button" className="w-full text-left">
          Editar categoría
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-[#091540]">Editar categoría</DialogTitle>
          <DialogDescription>
            Actualiza la información y el estado de la categoría seleccionada.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 px-6">
          <Badge variant={category.IsActive ? "default" : "destructive"}>
            {category.IsActive ? "Activa" : "Inactiva"}
          </Badge>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
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
                        placeholder="Ej. Fontanería"
                      />
                      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                    </Field>
                  );
                }}
              />
            </FieldGroup>

            <FieldGroup>
              <form.Field
                name="Description"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Descripción</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === " " || event.key === "Enter") {
                            event.stopPropagation();
                          }
                        }}
                        aria-invalid={isInvalid}
                        placeholder="Descripción de la categoría"
                        rows={3}
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
                        {field.state.value ? "Categoría activa" : "Categoría inactiva"}
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

export default UpdateCategoryModal;
