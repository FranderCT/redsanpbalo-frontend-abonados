import { toast } from "sonner";
import InhabilityActionModal from "@/Components/Modals/InhabilyActionModal";
import { useDeleteReportType } from "../../Hooks/ReportTypesHooks";
import type { ReportType } from "../../Models/ReportType";

type Props = {
  reportType: ReportType;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function DeleteReportTypeModal({
  reportType,
  open,
  onClose,
  onSuccess,
}: Props) {
  const deleteMutation = useDeleteReportType();

  const handleClose = () => {
    toast.warning("Edicion cancelada", {
      position: "top-right",
      duration: 3000,
    });
    onClose();
  };

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(reportType.Id);
      toast.success("Tipo de reporte eliminado");
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Error al eliminar tipo de reporte:", err);
      toast.error("No se pudo eliminar el tipo de reporte");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
      <InhabilityActionModal
        title="Eliminar tipo de reporte?"
        description={`Se eliminara el tipo "${reportType.Name ?? ""}".`}
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
        onConfirm={handleConfirm}
        onClose={handleClose}
        onCancel={handleClose}
      />
    </div>
  );
}
