import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
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
    <AlertDialog open={open} onOpenChange={(value) => !value && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar tipo de reporte</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará el tipo "{reportType.Name ?? ""}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
