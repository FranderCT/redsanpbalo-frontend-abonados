import { useState } from "react";
import { toast } from "sonner";
import InhabilityActionModal from "../../../../../Components/Modals/InhabilyActionModal";
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

  const question = faqSelected.Question?.trim() || "esta FAQ";

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteFAQMutation.mutateAsync(faqSelected.Id);
      toast.success("¡FAQ inhabilitada!", { position: "top-right", duration: 3000 });
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar la FAQ:", err);
      toast.error("No se pudo inhabilitar la FAQ", {
        position: "top-right",
        duration: 3000,
      });
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
        className="flex w-full items-center text-left"
        title="Inhabilitar FAQ"
      >
        Inhabilitar FAQ
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
          <InhabilityActionModal
            title="¿Inhabilitar FAQ?"
            description={`Se inhabilitará la pregunta "${question}".`}
            cancelLabel="Cancelar"
            confirmLabel={busy ? "Inhabilitando..." : "Inhabilitar"}
            onConfirm={handleConfirm}
            onClose={() => {
              if (!busy) setOpen(false);
            }}
            onCancel={() => {
              if (!busy) setOpen(false);
            }}
          />
        </div>
      )}
    </>
  );
}
