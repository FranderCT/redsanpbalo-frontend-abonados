import { useState } from "react";
import { toast } from "sonner";
import InhabilityActionModal from "../../../../../Components/Modals/InhabilyActionModal";
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

  const title = serviceSelected.Title?.trim() || "este servicio";

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteServiceMutation.mutateAsync(serviceSelected.Id);
      toast.success("¡Servicio inhabilitado!", { position: "top-right", duration: 3000 });
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar el servicio:", err);
      toast.error("No se pudo inhabilitar el servicio", {
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
        title="Inhabilitar servicio"
      >
        Inhabilitar servicio
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
          <InhabilityActionModal
            title="¿Inhabilitar servicio?"
            description={`Se inhabilitará el servicio "${title}".`}
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
