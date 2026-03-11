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
import type { Unit } from "../Models/unit";
import { useDeleteUnitMeasure } from "../Hooks/UnitMeasureHooks";
import UnitMeasureModalError from "./UnitMeasureModalError";

type Props = {
  unitSelected: Unit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function DeleteUnitMeasureModal({
  unitSelected,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [backendErrors, setBackendErrors] = useState<string[]>([]);
  const deleteUnitMutation = useDeleteUnitMeasure();

  const handleConfirm = async () => {
    try {
      setBusy(true);
      setBackendErrors([]);
      await deleteUnitMutation.mutateAsync(unitSelected.Id);
      toast.success("Unidad de medida inhabilitada");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const messages = getApiErrorMessages(err);
      setBackendErrors(messages);
      toast.error("No se pudo inhabilitar la unidad de medida", {
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
          <AlertDialogTitle>¿Inhabilitar unidad de medida?</AlertDialogTitle>
          <AlertDialogDescription>
            Se inhabilitará la unidad de medida "{unitSelected.Name ?? ""}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <UnitMeasureModalError messages={backendErrors} />
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
