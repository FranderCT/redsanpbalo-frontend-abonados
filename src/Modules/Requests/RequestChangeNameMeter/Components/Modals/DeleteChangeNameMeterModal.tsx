import { useState } from "react";
import { toast } from "react-toastify";
import { Trash } from "lucide-react";
import type { ReqChangeNameMeter } from "../../Models/RequestChangeNameMeter";
import { useDeleteReqChangeNameMeter } from "../../Hooks/RequestChangeNameMeterHooks";
import InhabilityActionModal from "../../../../../Components/Modals/InhabilyActionModal";


type Props = {
    reqChangeNameMeter: ReqChangeNameMeter;
    onSuccess?: () => void;
  
};

export default function DeleteRequestModal({ reqChangeNameMeter, onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const deleteReqChangeNameMeterMutation = useDeleteReqChangeNameMeter();
    const handleClose = () =>{
    toast.warning("Edición cancelado",{position:"top-right",autoClose:3000});
    setOpen(false);
 }
    const handleConfirm = async () => {
        try {
        setBusy(true);
        await deleteReqChangeNameMeterMutation.mutateAsync(reqChangeNameMeter.Id);
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
                title="¿Inhabilitar solicitud?"
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
