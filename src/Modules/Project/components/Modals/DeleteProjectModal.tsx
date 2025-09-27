import { useState } from "react";
import { toast } from "react-toastify";
import InhabilityActionModal from "../../../../Components/Modals/InhabilyActionModal";
import { Trash } from "lucide-react";
import type { Project } from "../../Models/Project";
import { useDeleteProject } from "../../Hooks/ProjectHooks";


type Props = {
  projectSelected: Project;
  onSuccess?: () => void;
  
};

export default function DeleteProjectButton({ projectSelected, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const deleteProjectMutation = useDeleteProject();
  const handleClose = () =>{
  toast.warning("Edición cancelada",{position:"top-right",autoClose:3000});
    setOpen(false);
 }
  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteProjectMutation.mutateAsync(projectSelected.Id);
      toast.success("Proyecto inhabilitado");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar el proyecto:", err);
      toast.error("No se pudo inhabilitar el proyecto");
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
        title="Inhabilitar proyecto"
      >
        <Trash  className="h-4 w-4"/>
        {busy ? "..." : "Inhabilitar"}
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
          <InhabilityActionModal
            title="¿Inhabilitar proyecto?"
            description={`Se inhabilitará el proyecto "${projectSelected.Name ?? ""}".`}
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
