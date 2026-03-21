import { useState } from "react";
import { toast } from "react-toastify";
import { Trash } from "lucide-react";
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
import { Button } from "@/Components/ui/button";
import type { ReqAssociated } from "../../Models/RequestAssociated";
import { useDeleteRequestAssociated } from "../../Hooks/ReqAssociatedHooks";



type Props = {
    reqAssociated: ReqAssociated;
    onSuccess?: () => void;
  
};

export default function DeleteRequestAssociatedModal({ reqAssociated, onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const deleteReqAssociatedMutation = useDeleteRequestAssociated();
    const handleClose = () =>{
    toast.warning("Edición cancelado",{position:"top-right",autoClose:3000});
    setOpen(false);
 }
    const handleConfirm = async () => {
        try {
        setBusy(true);
        await deleteReqAssociatedMutation.mutateAsync(reqAssociated.Id);
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
              variant="ghost"
              className="w-full justify-start rounded-none px-2 py-1.5 text-[#F6132D] hover:bg-[#F6132D]/10 hover:text-[#F6132D]"
              disabled={busy}
            >
              <Trash className="h-4 w-4" />
              {busy ? "Inhabilitando..." : "Inhabilitar"}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="rounded-none">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Inhabilitar solicitud?</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Está seguro de inhabilitar esta solicitud?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-none" onClick={handleClose}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-none bg-[#F6132D] text-white hover:bg-[#d90f27]"
                onClick={handleConfirm}
              >
                Inhabilitar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    );
}
