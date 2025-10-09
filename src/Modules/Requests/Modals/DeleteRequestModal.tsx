import { useState } from "react";
import { toast } from "react-toastify";
import { Trash } from "lucide-react";
import type { ReqAvailWater } from "../RequestAvailabilityWater/Models/ReqAvailWater";
import { useDeleteReqAvailWater } from "../RequestAvailabilityWater/Hooks/ReqAvailWaterHooks";
import InhabilityActionModal from "../../../Components/Modals/InhabilyActionModal";


type Props = {
    reqAvailWater: ReqAvailWater;
    onSuccess?: () => void;
  
};

export default function DeleteRequestModal({ reqAvailWater, onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const deleteReqAvailWaterMutation = useDeleteReqAvailWater();
    const handleClose = () =>{
    toast.warning("Edición cancelado",{position:"top-right",autoClose:3000});
    setOpen(false);
 }
    const handleConfirm = async () => {
        try {
        setBusy(true);
        await deleteReqAvailWaterMutation.mutateAsync(reqAvailWater.Id);
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
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={busy}
            className={`px-3 py-1 text-sm font-medium transition flex flex-row justify-center items-center gap-1
            ${busy ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "text-[#F6132D] border-[#F6132D] border hover:bg-[#F6132D] hover:text-[#F9F5FF]"}`}
            title="Inhabilitar solicitud"
        >
            <Trash  className="h-4 w-4"/>
            {busy ? "..." : "Inhabilitar"}
        </button>

        {open && (
            <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
            <InhabilityActionModal
                title="¿Inhabilitar categoría?"
                description={`¿Está seguro de inhabilitar esta solicitud?`}
                cancelLabel="Cancelar"
                confirmLabel="Inhabilitar"
                onConfirm={handleConfirm}
                onClose={handleClose}
                onCancel={handleClose}
            />
            </div>
        )}
        </>
    );
}
