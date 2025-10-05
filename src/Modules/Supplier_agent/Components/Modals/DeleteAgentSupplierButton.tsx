import { useState } from "react";
import { toast } from "react-toastify";
import InhabilityActionModal from "../../../../Components/Modals/InhabilyActionModal";
import { Trash } from "lucide-react";

import { useDeleteAgentSupplier } from "../../Hooks/SupplierAgentHooks";
import type { AgentSupplier } from "../../../Supplier/Models/AgentSupplier";

type Props = {
  agent: AgentSupplier;       // ← SINGULAR y usando el modelo unificado
  onSuccess?: () => void;
};

export default function DeleteAgentSupplierButton({ agent, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const deleteAgentSupplierMutation = useDeleteAgentSupplier();

  const handleClose = () => {
    toast.warning("Acción cancelada", { position: "top-right", autoClose: 3000 });
    setOpen(false);
  };

  const handleConfirm = async () => {
    if (typeof agent.Id !== "number") {
      toast.error("No se encontró el Id del agente", { position: "top-right", autoClose: 3000 });
      return;
    }
    try {
      setBusy(true);
      await deleteAgentSupplierMutation.mutateAsync(agent.Id);
      toast.success("Agente físico inhabilitado", { position: "top-right", autoClose: 3000 });
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar proveedor físico:", err);
      toast.error("No se pudo inhabilitar el agente", { position: "top-right", autoClose: 3000 });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={busy || typeof agent.Id !== "number"}
        className={`px-3 py-1 text-sm font-medium transition flex flex-row justify-center items-center gap-1
          ${busy ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "text-[#F6132D] border-[#F6132D] border hover:bg-[#F6132D] hover:text-[#F9F5FF]"}`}
        title="Inhabilitar agente"
      >
        <Trash className="h-4 w-4" />
        {busy ? "..." : "Inhabilitar"}
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
          <InhabilityActionModal
            title="¿Inhabilitar agente?"
            description={`Se inhabilitará el agente "${agent.Name ?? ""}".`}
            cancelLabel="Cancelar"
            confirmLabel="Inhabilitar"
            onConfirm={handleConfirm}
            onClose={handleClose}
            onCancel={handleClose}
          />
        </div>
      )}
    </>
  );
}
