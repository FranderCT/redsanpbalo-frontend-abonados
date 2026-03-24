import { useState } from "react";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { Button } from "@/Components/ui/button";
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
import type { ReqChangeMeter } from "../Models/RequestChangeMeter";
import { useDeleteReqChangeMeter } from "../Hooks/RequestChangeMeter";


type Props = {
    reqChangeMeter: ReqChangeMeter;
    onSuccess?: () => void;
  
};

export default function DeleteRequestModal({ reqChangeMeter, onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const deleteReqChangeMeterMutation = useDeleteReqChangeMeter();

    const handleClose = () =>{
      toast.warning("Edición cancelada",{position:"top-right",duration:3000});
      setOpen(false);
    }

    const handleConfirm = async () => {
        try {
        setBusy(true);
        await deleteReqChangeMeterMutation.mutateAsync(reqChangeMeter.Id);
        toast.success("Solicitud inhabilitada");
        setOpen(false);
        onSuccess?.();
        } catch (err) {
        console.error("Error al inhabilitar solicitud:", err);
        toast.error("No se pudo inhabilitar la solicitud");
        } finally {
        setBusy(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              className="rounded-none border-[#F6132D] text-[#F6132D] hover:bg-[#F6132D] hover:text-white"
              title="Inhabilitar solicitud"
            >
              <Trash className="h-4 w-4" />
              {busy ? "..." : "Inhabilitar"}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="rounded-none border-slate-200">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Inhabilitar solicitud?</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Está seguro de inhabilitar esta solicitud?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-none" onClick={handleClose}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                className="rounded-none bg-[#F6132D] text-white hover:bg-red-700"
                onClick={handleConfirm}
              >
                Inhabilitar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    );
}
