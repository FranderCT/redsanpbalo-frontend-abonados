import { useState } from "react";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import type { PhysicalSupplier } from "../../Models/PhysicalSupplier";
import { useDeletePhysicalSupplier } from "../../Hooks/PhysicalSupplierHooks";

type Props = {
  supplier: PhysicalSupplier;
  onSuccess?: () => void;
};

export default function DeletePhysicalSupplierModal({ supplier, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeletePhysicalSupplier();
  const fullName = [supplier.Supplier?.Name, supplier.Surname1, supplier.Surname2]
    .filter(Boolean)
    .join(" ")
    .trim();

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(supplier.Id);
      toast.success("Proveedor inhabilitado");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar proveedor:", err);
      toast.error("No se pudo inhabilitar el proveedor");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash className="h-4 w-4" />
          Inhabilitar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Inhabilitar proveedor?</AlertDialogTitle>
          <AlertDialogDescription>
            Se inhabilitará el proveedor &quot;{fullName || supplier.Supplier?.Name || "sin nombre"}&quot;.
            Esta acción puede revertirse desde la edición del proveedor.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
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
