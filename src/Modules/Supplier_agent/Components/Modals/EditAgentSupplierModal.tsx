import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { useEditAgentSupplier } from "../../Hooks/SupplierAgentHooks";
import type { AgentSupppliers } from "../../Models/SupplierAgent";


type Props = {
  agent: AgentSupppliers;   // trae Id y campos del agente
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const EditAgentSupplierModal = ({ agent, open, onClose, onSuccess }: Props) => {
  const updateAgentMutation = useEditAgentSupplier();

  const SPANSTYLES = "text text-[#222]";
  const LABELSTYLES = "grid gap-1";
  const INPUTSTYLES = "w-full px-4 py-2 bg-gray-50 border";

  const form = useForm({
    defaultValues: {
      Name: agent?.Name ?? "",
      Surname1: agent?.Surname1 ?? "",
      Surname2: agent?.Surname2 ?? "",
      Email: agent?.Email ?? "",
      PhoneNumber: agent?.PhoneNumber ?? "",
      IsActive : agent?.IsActive ?? 0,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateAgentMutation.mutateAsync({
          id: agent.Id,
          data: value, 
        });
        form.reset();
        onSuccess?.();
        onClose?.();
      } catch (err) {
        console.error("Error al actualizar el agente", err);
      }
    },
  });


  useEffect(() => {
    if (!agent || !open) return;
    form.reset({
      Name: agent.Name ?? "",
      Surname1: agent.Surname1 ?? "",
      Surname2: agent.Surname2 ?? "",
      Email: agent.Email ?? "",
      PhoneNumber: agent.PhoneNumber ?? "",
      IsActive: agent.IsActive ?? 0
    });
    
  }, [agent, open]);

  const handleClose = () => {
    toast.warning("Edición cancelada", { position: "top-right", autoClose: 3000 });
    form.reset();
    onClose();
  };

  return (
    <ModalBase
      open={open}
      onClose={handleClose}
      panelClassName="w-[min(30vw,700px)] p-4"
    >
      <header className="flex flex-col">
        <h2 className="text-2xl text-[#091540] font-bold">Editar agente</h2>
        <p className="text-md">Actualice la información del agente del proveedor</p>
      </header>

      <div className="border-b border-[#222]/10 my-2" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="grid gap-3"
      >
        {/* Nombre */}
        <form.Field name="Name">
          {(field) => (
            <label className={LABELSTYLES}>
              <span className={SPANSTYLES}>Nombre</span>
              <input
                className={INPUTSTYLES}
                placeholder="ejm. María"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              />
            </label>
          )}
        </form.Field>

        {/* Primer apellido */}
        <form.Field name="Surname1">
          {(field) => (
            <label className={LABELSTYLES}>
              <span className={SPANSTYLES}>Primer apellido</span>
              <input
                className={INPUTSTYLES}
                placeholder="ejm. Rodríguez"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              />
            </label>
          )}
        </form.Field>

        {/* Segundo apellido (opcional) */}
        <form.Field name="Surname2">
          {(field) => (
            <label className={LABELSTYLES}>
              <span className={SPANSTYLES}>Segundo apellido (opcional)</span>
              <input
                className={INPUTSTYLES}
                placeholder="ejm. Gómez"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </label>
          )}
        </form.Field>

        {/* Email */}
        <form.Field name="Email">
          {(field) => (
            <label className={LABELSTYLES}>
              <span className={SPANSTYLES}>Correo electrónico</span>
              <input
                type="email"
                className={INPUTSTYLES}
                placeholder="ejm. maria.rodriguez@empresa.com"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              />
            </label>
          )}
        </form.Field>

        {/* Teléfono */}
        <form.Field name="PhoneNumber">
          {(field) => (
            <div className={LABELSTYLES}>
              <span className={SPANSTYLES}>Número de teléfono</span>
              <PhoneField
                value={field.state.value ?? ""}
                onChange={(val) => field.handleChange(val ?? "")}
                defaultCountry="CR"
                required
                error={
                  field.state.meta.isTouched && field.state.meta.errors[0]
                    ? String(field.state.meta.errors[0])
                    : undefined
                }
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {(field.state.meta.errors[0] as any)?.message ??
                    String(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="IsActive">
          {(field) => (
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <span className="text-sm text-gray-700">
                {field.state.value ? "Activo" : "Inactivo"}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={!!field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5"></div>
              </div>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {(field.state.meta.errors[0] as any)?.message ??
                    String(field.state.meta.errors[0])}
                </p>
              )}
            </label>
          )}
        </form.Field>

        {/* Botones */}
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="submit"
                className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Guardando…" : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="h-10 px-4 bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </ModalBase>
  );
};

export default EditAgentSupplierModal;
