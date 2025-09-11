import { useState } from "react";
import { toast } from "react-toastify";
import InhabilityActionModal from "../../../../Components/Modals/InhabilyActionModal";
import { Trash } from "lucide-react";
import type { Unit } from "../../Models/unit";
import { useDeleteUnitMeasure } from "../../Hooks/UnitMeasureHooks";


type Props = {
  unitSelected: Unit;
  onSuccess?: () => void;
};

export default function DeleteUnitButton({ unitSelected, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const deleteUnitMutation = useDeleteUnitMeasure();

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteUnitMutation.mutateAsync(unitSelected.Id);
      toast.success("Unidad de medida inhabilitada");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar la unidad de medida:", err);
      toast.error("No se pudo inhabilitar la unidad de medida");
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
        title="Inhabilitar unidad de medida"
      >
        <Trash  className="h-4 w-4"/>
        {busy ? "..." : "Inhabilitar"}
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
          <InhabilityActionModal
            title="¿Inhabilitar unidad de medida?"
            description={`Se inhabilitará la unidad de medida "${unitSelected.Name ?? ""}".`}
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
