import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteCategory } from "../../Hooks/CategoryHooks";
import type { Category } from "../../Models/Category";
import InhabilityActionModal from "../../../../Components/Modals/InhabilyActionModal";
import { Trash } from "lucide-react";


type Props = {
  categorySelected: Category;
  onSuccess?: () => void;
};

export default function DeleteCategoryButton({ categorySelected, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const deleteCategoryMutation = useDeleteCategory();

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteCategoryMutation.mutateAsync(categorySelected.Id);
      toast.success("Categoría inhabilitada");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar categoría:", err);
      toast.error("No se pudo inhabilitar la categoría");
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
          ${busy ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "text-[#F6132D] border-[#F6132D] border hover:bg-[#F6132D] hover:text-[#F9F5FF]"}`}
        title="Inhabilitar categoría"
      >
        <Trash  className="h-4 w-4"/>
        {busy ? "..." : "Inhabilitar"}
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
          <InhabilityActionModal
            title="¿Inhabilitar categoría?"
            description={`Se inhabilitará la categoría "${categorySelected.Name ?? ""}".`}
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
