import { useState } from "react";
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
import type { Product } from "../../Models/CreateProduct";
import { useDeleteProduct } from "../../Hooks/ProductsHooks";

type Props = {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function DeleteProductModal({ product, open, onOpenChange, onSuccess }: Props) {
  const [busy, setBusy] = useState(false);
  const deleteProductMutation = useDeleteProduct();

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteProductMutation.mutateAsync(product.Id);
      toast.success("Producto inhabilitado");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar producto:", err);
      toast.error("No se pudo inhabilitar el producto");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Inhabilitar producto?</AlertDialogTitle>
          <AlertDialogDescription>
            Se inhabilitará el producto "{product.Name}" y dejará de estar disponible para nuevos registros.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="justify-between sm:justify-between sm:space-x-0">
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
            className="bg-red-600 hover:bg-red-700"
            disabled={busy}
          >
            {busy ? "Inhabilitando…" : "Inhabilitar"}
          </AlertDialogAction>
          <AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
