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
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { useEditAgentSupplier } from "../../Hooks/SupplierAgentHooks";
import type { AgentSupppliers } from "../../Models/SupplierAgent";
import { UpdateAgentSupplierSchema } from "../../Schemas/UpdateSupplierAgentSchema";

type Props = {
  agent: AgentSupppliers;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function EditAgentSupplierModal({
  agent,
  open,
  onClose,
  onSuccess,
}: Props) {
  const updateMutation = useEditAgentSupplier();

  const form = useForm({
    defaultValues: {
      Email: agent?.Email ?? "",
      PhoneNumber: agent?.PhoneNumber ?? "",
      IsActive: agent?.IsActive ?? true,
    },
    validators: { onChange: UpdateAgentSupplierSchema },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync({ id: agent.Id, data: value });
        form.reset();
        onSuccess?.();
        onClose();
      } catch (err) {
        console.error("Error al actualizar el agente", err);
      }
    },
  });

  useEffect(() => {
    if (!agent || !open) return;
    form.setFieldValue("Email", agent.Email ?? "");
    form.setFieldValue("PhoneNumber", agent.PhoneNumber ?? "");
    form.setFieldValue("IsActive", agent.IsActive ?? true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent, open]);

  const handleClose = () => {
    toast.warning("Edición cancelada", { position: "top-right", autoClose: 3000 });
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="flex max-h-[70vh] max-w-xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Editar agente</DialogTitle>
          <DialogDescription>
            Actualice la información del agente del proveedor.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-agent-supplier-form"
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
            <div className="flex flex-col gap-4">
              <form.Field name="Email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && field.state.meta.errors.length > 0;
                  return (
                    <FieldGroup className="gap-2">
                      <Field>
                        <FieldLabel>Correo electrónico</FieldLabel>
                        <Input
                          type="email"
                          placeholder="ejm. maria.rodriguez@empresa.com"
                          value={field.state.value ?? ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={isInvalid ? "border-destructive" : ""}
                        />
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    </FieldGroup>
                  );
                }}
              </form.Field>

              <form.Field name="PhoneNumber">
                {(field) => (
                  <FieldGroup className="gap-2">
                    <Field>
                      <FieldLabel>Número de teléfono</FieldLabel>
                      <PhoneField
                        value={field.state.value ?? ""}
                        onChange={(val) => field.handleChange(val ?? "")}
                        defaultCountry="CR"
                        error={
                          field.state.meta.isTouched && field.state.meta.errors[0]
                            ? String(field.state.meta.errors[0])
                            : undefined
                        }
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  </FieldGroup>
                )}
              </form.Field>

              <form.Field name="IsActive">
                {(field) => (
                  <FieldGroup className="gap-2">
                    <Field>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="edit-agent-is-active"
                          checked={!!field.state.value}
                          onChange={(e) => field.handleChange(e.target.checked)}
                          className="h-4 w-4 rounded border-input"
                        />
                        <FieldLabel
                          htmlFor="edit-agent-is-active"
                          className="cursor-pointer font-normal"
                        >
                          Agente activo
                        </FieldLabel>
                      </div>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  </FieldGroup>
                )}
              </form.Field>
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
                    form="edit-agent-supplier-form"
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
