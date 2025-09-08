import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import type { Material } from "../Models/Material";
import { useDeleteMaterial } from "../Hooks/MaterialHooks";
import InhabilityActionModal from "../../../Components/Modals/InhabilyActionModal";

// Tipo de fila extendido (solo para UI)
export type RowMaterial = Material & { Id: number; IsActive?: boolean };

type Props = {
  material: RowMaterial;
  onSuccess?: () => void;
};

export default function DeleteMaterialButton({ material, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const deleteMaterialMutation = useDeleteMaterial();

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteMaterialMutation.mutateAsync(material.Id);
      toast.success("Material inhabilitado");
      setOpen(false);
      onSuccess?.();
      await qc.invalidateQueries({ queryKey: ["materials"] });
      await qc.invalidateQueries({ queryKey: ["materials", material.Id] });
    } catch (err) {
      console.error("Error al inhabilitar material:", err);
      toast.error("No se pudo inhabilitar el material");
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
        className={`px-3 py-1 text-sm font-medium transition
          ${busy ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}
        title="Ihabilitar material"
      >
        {busy ? "..." : "Inhabilitar"}
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
          <InhabilityActionModal
            title="¿Inhabilitar material?"
            description={`Se inhabilitará el material "${material.Name ?? ""}".`}
            cancelLabel="Cancelar"
            confirmLabel="Inhabilitar"
            onConfirm={handleConfirm}
            onClose={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            
          />
        </div>
      )}
    </>
  );
}
