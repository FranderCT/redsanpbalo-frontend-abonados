import { useState } from "react";
import { toast } from "react-toastify";
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
import type { Material } from "../Models/Material";
import { useDeleteMaterial } from "../Hooks/MaterialHooks";

type Props = {
  materialSelected: Material;
  onSuccess?: () => void;
};

export default function DeleteMaterialModal({ materialSelected, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const deleteMaterialMutation = useDeleteMaterial();

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteMaterialMutation.mutateAsync(materialSelected.Id);
      toast.success("Material inhabilitado");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar el material:", err);
      toast.error("No se pudo inhabilitar el material");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button type="button" className="w-full text-left text-red-600">
          Inhabilitar material
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Inhabilitar material?</AlertDialogTitle>
          <AlertDialogDescription>
            Se inhabilitará el material "{materialSelected.Name ?? ""}".
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
