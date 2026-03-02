import { useState } from "react";
import { toast } from "react-toastify";
import InhabilityActionModal from "@/Components/Modals/InhabilyActionModal";
import { useDeleteReportLocation } from "../../Hooks/ReportLocationHooks";
import type { ReportLocation } from "../../Models/ReportLocation";

type Props = {
  reportLocation: ReportLocation;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function DeleteReportLocationModal({
  reportLocation,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [busy, setBusy] = useState(false);
  const deleteMutation = useDeleteReportLocation();

  const handleClose = () => {
    toast.warning("Edición cancelada", {
      position: "top-right",
      autoClose: 3000,
    });
    onClose();
  };

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteMutation.mutateAsync(reportLocation.Id);
      toast.success("Ubicación eliminada");
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Error al eliminar ubicación:", err);
      toast.error("No se pudo eliminar la ubicación");
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
      <InhabilityActionModal
        title="¿Eliminar ubicación?"
        description={`Se eliminará la ubicación "${reportLocation.Neighborhood ?? ""}".`}
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
        onConfirm={handleConfirm}
        onClose={handleClose}
        onCancel={handleClose}
      />
    </div>
  );
}
