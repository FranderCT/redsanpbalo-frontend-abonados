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
    <AlertDialog open={open} onOpenChange={(value) => !value && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar ubicación</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará la ubicación "{reportLocation.Neighborhood ?? ""}".
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
