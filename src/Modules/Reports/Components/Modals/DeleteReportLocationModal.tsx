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
  const deleteMutation = useDeleteReportLocation();

  const handleClose = () => {
    toast.warning("Edicion cancelada", {
      position: "top-right",
      autoClose: 3000,
    });
    onClose();
  };

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(reportLocation.Id);
      toast.success("Ubicacion eliminada");
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Error al eliminar ubicacion:", err);
      toast.error("No se pudo eliminar la ubicacion");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
      <InhabilityActionModal
        title="Eliminar ubicacion?"
        description={`Se eliminara la ubicacion "${reportLocation.Neighborhood ?? ""}".`}
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
        onConfirm={handleConfirm}
        onClose={handleClose}
        onCancel={handleClose}
      />
    </div>
  );
}
