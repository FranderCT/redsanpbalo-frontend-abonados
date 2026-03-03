import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import type { LegalSupplier } from "../../Models/LegalSupplier";
import { useDeleteLegalSupplier } from "../../Hooks/LegalSupplierHooks";

type Props = {
  legalsupplier: LegalSupplier | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function DeleteLegalSupplierModal({
  legalsupplier,
  open,
  onClose,
  onSuccess,
}: Props) {
  const deleteMutation = useDeleteLegalSupplier();
  const companyName = legalsupplier?.Supplier?.Name ?? "sin nombre";

  const handleConfirm = async () => {
    if (!legalsupplier) return;
    try {
      await deleteMutation.mutateAsync(legalsupplier.Id);
      toast.success("Proveedor jurídico inhabilitado");
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar proveedor jurídico:", err);
      toast.error("No se pudo inhabilitar el proveedor jurídico");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Inhabilitar proveedor?</AlertDialogTitle>
          <AlertDialogDescription>
            Se inhabilitará el proveedor &quot;{companyName}&quot;.
            Esta acción puede revertirse desde la edición del proveedor.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Inhabilitando…" : "Inhabilitar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
