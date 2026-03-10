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
import type { Unit } from "../Models/unit";
import { useDeleteUnitMeasure } from "../Hooks/UnitMeasureHooks";

type Props = {
  unitSelected: Unit;
  onSuccess?: () => void;
};

export default function DeleteUnitMeasureModal({ unitSelected, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const deleteUnitMutation = useDeleteUnitMeasure();

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteUnitMutation.mutateAsync(unitSelected.Id);
      toast.success("Unidad de medida inhabilitada");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar la unidad de medida:", err);
      toast.error("No se pudo inhabilitar la unidad de medida");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button type="button" className="w-full text-left text-red-600">
          Inhabilitar unidad
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Inhabilitar unidad de medida?</AlertDialogTitle>
          <AlertDialogDescription>
            Se inhabilitará la unidad de medida "{unitSelected.Name ?? ""}".
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
