import { useState } from "react";
import { toast } from "react-toastify";
import { Trash } from "lucide-react";
import type { Material } from "../../Models/Material";
import { useDeleteMaterial } from "../../Hooks/MaterialHooks";
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
} from "../../../../Components/ui/alert-dialog";
import { Button, buttonVariants } from "../../../../Components/ui/button";

type Props = {
  materialSelected: Material;
  onSuccess?: () => void;
};

export default function DeleteMaterialButton({ materialSelected, onSuccess }: Props) {
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
        <Button
          type="button"
          disabled={busy}
          variant="destructive"
          // className={`px-3 py-1 text-sm font-medium transition flex flex-row justify-center items-center gap-1
          //   ${busy ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "text-[#F6132D] border-[#F6132D] border hover:bg-[#F6132D] hover:text-[#F9F5FF]"}`}
          title="Inhabilitar material"

        >
          <Trash />
          {busy ? "..." : "Inhabilitar"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Inhabilitar material?</AlertDialogTitle>
          <AlertDialogDescription>
            Se inhabilitará el material "{materialSelected.Name ?? ""}". Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={busy}
            className={buttonVariants({ variant: "destructive" })}
          >
            {busy ? "..." : "Inhabilitar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
