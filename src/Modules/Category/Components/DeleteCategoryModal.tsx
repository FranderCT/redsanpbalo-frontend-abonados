import { toast } from "sonner";
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
} from "@/Components/ui/alert-dialog";

type Props = {
  categorySelected: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function DeleteCategoryButton({
  categorySelected,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const deleteCategoryMutation = useDeleteCategory();
  const busy = deleteCategoryMutation.isPending;

  const handleConfirm = async () => {
    if (!categorySelected) return;

    try {
      await deleteCategoryMutation.mutateAsync(categorySelected.Id);
      toast.success("Categoria inhabilitada");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar categoría:", err);
      toast.error("No se pudo inhabilitar la categoria");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Inhabilitar categoría?</AlertDialogTitle>
          <AlertDialogDescription>
            Se inhabilitará la categoría "{categorySelected?.Name ?? ""}".
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
