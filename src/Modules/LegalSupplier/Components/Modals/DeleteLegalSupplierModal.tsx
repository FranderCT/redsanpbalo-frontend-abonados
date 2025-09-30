import { useState } from "react";
import { toast } from "react-toastify";
import InhabilityActionModal from "../../../../Components/Modals/InhabilyActionModal";
import { Trash } from "lucide-react";
import type { LegalSupplier } from "../../Models/LegalSupplier";
import { useDeleteLegalSupplier } from "../../Hooks/LegalSupplierHooks";



type Props = {
    legalsupplier: LegalSupplier;
    onSuccess?: () => void;
};

export default function DeletePhysicalSupplierModal({ legalsupplier, onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const deleteLegalSupplierMutation = useDeleteLegalSupplier();
    const handleClose = () =>{
    toast.warning("Edición cancelado",{position:"top-right",autoClose:3000});
    setOpen(false);
 }
    const handleConfirm = async () => {
        try {
        setBusy(true);
        await deleteLegalSupplierMutation.mutateAsync(legalsupplier.Id);
        toast.success("Proveedor jurídico inhabilitado", {position: 'top-right', autoClose: 3000});
        setOpen(false);
        onSuccess?.();
        } catch (err) {
        console.error("Error al inhabilitar proveedor jurídico:", err);
        toast.error("No se pudo inhabilitar el proveedor jurídico", {position: 'top-right', autoClose: 3000});
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
            title="Inhabilitar proveedor"
        >
            <Trash  className="h-4 w-4"/>
            {busy ? "..." : "Inhabilitar"}
        </button>

        {open && (
            <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
            <InhabilityActionModal
                title="¿Inhabilitar proveedor?"
                description={`Se inhabilitará el proveedor "${legalsupplier.CompanyName ?? ""}".`}
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
