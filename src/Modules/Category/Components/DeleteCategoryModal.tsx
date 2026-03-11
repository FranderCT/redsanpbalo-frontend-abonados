import { useState } from "react";
import { toast } from "react-toastify";
import { useDeleteCategory } from "../Hooks/CategoryHooks";
import type { Category } from "../Models/Category";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";

type Props = {
  categorySelected: Category;
  onSuccess?: () => void;
};

export default function DeleteCategoryButton({ categorySelected, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const deleteCategoryMutation = useDeleteCategory();

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteCategoryMutation.mutateAsync(categorySelected.Id);
      toast.success("Categoría inhabilitada");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar categoría:", err);
      toast.error("No se pudo inhabilitar la categoría");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button type="button" className="w-full text-left text-red-600">
          Inhabilitar categoría
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Inhabilitar categoría?</AlertDialogTitle>
          <AlertDialogDescription>
            Se inhabilitará la categoría "{categorySelected.Name ?? ""}".
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
            {busy ? "Inhabilitando..." : "Inhabilitar"}
          </AlertDialogAction>
          <AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
