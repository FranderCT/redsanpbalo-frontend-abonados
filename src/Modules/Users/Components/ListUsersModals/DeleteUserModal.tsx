// src/Modules/Users/Components/DeleteUserModal.tsx
import { useState } from "react";
import { toast } from "react-toastify";
import type { Users } from "../../Models/Users";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useDeleteUser } from "../../Hooks/UsersHooks";

type Props = {
  user: Users;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const DeleteUserModal = ({ user, open, onClose, onSuccess }: Props) => {
  const DeleteMutation = useDeleteUser(); 
  const [confirmText, setConfirmText] = useState("");

  const confirm = `confirmar`.trim();
  const fullName = `${user.Name ?? ""} ${user.Surname1 ?? ""} ${user.Surname2 ?? ""}`.trim();

  const handleDelete = async () => {
    try {
      await DeleteMutation.mutateAsync(user.Id); 
      toast.success("¡Usuario desactivado!", { position: "top-right", autoClose: 3000 });
      onClose();
      onSuccess();
    } catch (err) {
      console.error("Error desactivando usuario:", err);
      toast.error("No se pudo desactivar el usuario", { position: "top-right", autoClose: 3000 });
    }
  };

  const canDelete = confirmText.trim().toLowerCase() === confirm.toLowerCase() 

  return (
    <ModalBase open={open} onClose={onClose} panelClassName="w-full max-w-xl !p-0 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <h3 className="text-xl font-bold text-[#091540]">Desactivar Usuario</h3>
      </div>

      {/* Body */}
      <div className="p-6 bg-white space-y-4">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-[#091540]">
            Estás a punto de <span className="font-semibold text-[#F6132D]">Desactivar</span> al usuario:
          </p>
          <p className="mt-1 text-base font-semibold break-words">{fullName || user.Email || "-"}</p>
          <p className="text-xs text-gray-600 mt-1">Cédula: {user.IDcard ?? "-"}</p>
          <p className="text-xs text-gray-600">Correo: {user.Email ?? "-"}</p>
        </div>

        <div className="p-3 border border-red-200 bg-red-50 rounded">
          <p className="text-sm text-red-700">
            Esta acción solo desactivará la cuenta. No se eliminarán registros para preservar la integridad de la Base de Datos.
          </p>
        </div>

        {/* Confirmación por texto */}
        <label className="grid gap-1">
          <span className="text-sm text-gray-700">
            Escribe <span className="font-semibold">{confirm || user.Email}</span> para confirmar
          </span>
          <input
            className="w-full px-4 py-2 bg-gray-50 border outline-none focus:ring-2 focus:ring-[#1789FC]"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={`Escribe "${confirm || user.Email}"`}
          />
          <span className="text-xs text-gray-500">
            También puedes escribir el correo <span className="font-medium">{user.Email}</span>.
          </span>
        </label>

        {/* Acciones */}
        <div className="mt-2 flex justify-end items-center gap-2">
          <button
            type="button"
            onClick={(onClose)}
            className="h-10 px-4 bg-[#F9F5FF] text-[#091540] border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canDelete || DeleteMutation.isPending}
            onClick={handleDelete}
            className="h-10 px-5 rounded bg-[#F6132D] text-white hover:bg-[#091540] disabled:opacity-60 transition"
          >
            {DeleteMutation.isPending ? "Desactivando…" : "Desactivar"}
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default DeleteUserModal;
