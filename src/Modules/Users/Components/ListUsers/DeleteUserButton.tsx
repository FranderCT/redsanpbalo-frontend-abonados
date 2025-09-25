import { useState } from "react";
import { toast } from "react-toastify";
import { Trash } from "lucide-react";
import type { User } from "../../Models/User";
import { useDeleteUser } from "../../Hooks/UsersHooks";
import InhabilityActionModal from "../../../../Components/Modals/InhabilyActionModal";

interface Props {
  userSelected: User;
  onSuccess?: () => void;
}

export default function DeleteUserButton({ userSelected, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const deleteUserMutation = useDeleteUser();

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await deleteUserMutation.mutateAsync(userSelected.Id);
      toast.success("Usuario inhabilitado");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error al inhabilitar usuario:", err);
      toast.error("No se pudo inhabilitar el usuario");
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
        className={`px-3 py-1 text-sm font-medium transition flex flex-row justify-center items-center gap-1 cursor-pointer
          ${busy ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "text-[#F6132D] border-[#F6132D] border hover:bg-[#F6132D] hover:text-[#F9F5FF]"}`}
        title="Inhabilitar usuario"
      >
        <Trash className="h-4 w-4" />
        {busy ? "..." : "Inhabilitar"}
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
          <InhabilityActionModal
            title="¿Inhabilitar usuario?"
            description={`Se inhabilitará el usuario \"${userSelected.Name ?? ""} ${userSelected.Surname1 ?? ""} ${userSelected.Surname2 ?? ""}\".`}
            cancelLabel="Cancelar"
            confirmLabel="Inhabilitar"
            onConfirm={handleConfirm}
            onClose={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
}
