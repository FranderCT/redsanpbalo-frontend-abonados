import { useState } from "react";
import { toast } from "react-toastify";
import InhabilityActionModal from "../../../../../Components/Modals/InhabilyActionModal";
import { Trash } from "lucide-react";
import type { Service } from "../../Models/Services";
import { useDeleteMaterial } from "../../Hooks/ServicesHooks";

type Props = {
  serviceSelected: Service;
  onSuccess?: () => void;
};

export default function DeleteServiceButton({ serviceSelected, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const deleteServiceMutation = useDeleteMaterial();

  const handleClose = () => {
    toast.warning("Edición cancelada", { position: "top-right", autoClose: 3000 });
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteServiceMutation.mutateAsync(serviceSelected.Id);
      toast.success("Servicio inhabilitado");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar el servicio:", err);
      toast.error("No se pudo inhabilitar el servicio");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={busy}
        className={`px-3 py-1 text-sm font-medium transition flex flex-row justify-center items-center gap-1
          ${busy ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "text-[#F6132D] border-[#F6132D] border hover:bg-[#F6132D] hover:text-white"}`}
        title="Inhabilitar servicio"
      >
        <Trash className="h-4 w-4" />
        {busy ? "..." : "Inhabilitar"}
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
          <InhabilityActionModal
            title="¿Inhabilitar servicio?"
            description={`Se inhabilitará el servicio "${serviceSelected.Title ?? ""}".`}
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
