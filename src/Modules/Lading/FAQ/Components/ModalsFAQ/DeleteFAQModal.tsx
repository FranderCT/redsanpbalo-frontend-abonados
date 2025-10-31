import { useState } from "react";
import { toast } from "react-toastify";
import InhabilityActionModal from "../../../../../Components/Modals/InhabilyActionModal";
import { Trash } from "lucide-react";
import type { FAQ } from "../../Models/FAQ";
import { useDeleteFAQ } from "../../Hooks/FAQHooks";

type Props = {
  faqSelected: FAQ;
  onSuccess?: () => void;
};

export default function DeleteFAQButton({ faqSelected, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const deleteFAQMutation = useDeleteFAQ();

  const handleClose = () => {
    toast.warning("Edición cancelada", { position: "top-right", autoClose: 3000 });
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteFAQMutation.mutateAsync(faqSelected.Id);
      toast.success("FAQ inhabilitada");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar la FAQ:", err);
      toast.error("No se pudo inhabilitar la FAQ");
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
        title="Inhabilitar FAQ"
      >
        <Trash className="h-4 w-4" />
        {busy ? "..." : "Inhabilitar"}
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
          <InhabilityActionModal
            title="¿Inhabilitar FAQ?"
            description={`Se inhabilitará la pregunta "${faqSelected.Question ?? ""}".`}
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
