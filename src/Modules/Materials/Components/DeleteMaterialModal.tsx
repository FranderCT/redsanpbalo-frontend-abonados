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
import { getApiErrorMessages } from "@/core/api-error";
import type { Material } from "../Models/Material";
import { useDeleteMaterial } from "../Hooks/MaterialHooks";
import MaterialModalError from "./MaterialModalError";

type Props = {
  materialSelected: Material;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function DeleteMaterialModal({
  materialSelected,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [backendErrors, setBackendErrors] = useState<string[]>([]);
  const deleteMaterialMutation = useDeleteMaterial();

  const handleConfirm = async () => {
    try {
      setBusy(true);
      setBackendErrors([]);
      await deleteMaterialMutation.mutateAsync(materialSelected.Id);
      toast.success("Material inhabilitado");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const messages = getApiErrorMessages(err);
      setBackendErrors(messages);
      toast.error("No se pudo inhabilitar el material", {
        description: messages[0],
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setBackendErrors([]);
        }
        onOpenChange(nextOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Inhabilitar material?</AlertDialogTitle>
          <AlertDialogDescription>
            Se inhabilitará el material "{materialSelected.Name ?? ""}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <MaterialModalError messages={backendErrors} />

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
