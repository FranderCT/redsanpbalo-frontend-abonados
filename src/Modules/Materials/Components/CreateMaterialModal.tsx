import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { getApiErrorMessages } from "@/core/api-error";
import { Plus } from "lucide-react";
import { useCreateMaterial } from "../Hooks/MaterialHooks";
import { newMaterialInitialState } from "../Models/Material";
import { MaterialSchema } from "../schemas/Materials/MaterialSchema";
import MaterialModalError from "./MaterialModalError";

const CreateMaterialModal = () => {
  const [open, setOpen] = useState(false);
  const [backendErrors, setBackendErrors] = useState<string[]>([]);
  const createMaterialMutation = useCreateMaterial();

  const form = useForm({
    defaultValues: newMaterialInitialState,
    validators: {
      onChange: MaterialSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        setBackendErrors([]);
        await createMaterialMutation.mutateAsync({
          Name: value.Name.trim(),
        });
        toast.success("Material creado");
        formApi.reset();
        setOpen(false);
      } catch (err) {
        const messages = getApiErrorMessages(err);
        setBackendErrors(messages);
        toast.error("No se pudo crear el material", {
          description: messages[0],
        });
      }
    },
  });

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    setBackendErrors([]);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Crear material
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-[#091540]">Crear material</DialogTitle>
          <DialogDescription>
            Completa los datos del nuevo material.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4 px-6 pb-6"
        >
          <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
            <MaterialModalError messages={backendErrors} />
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
                        autoComplete="off"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          setBackendErrors([]);
                          field.handleChange(event.target.value);
                        }}
                        aria-invalid={isInvalid}
                        placeholder="Ej. acero…"
                      />
                      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                    </Field>
                  );
                }}
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
                    {isSubmitting ? "Creando…" : "Crear material"}
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

export default CreateMaterialModal;
