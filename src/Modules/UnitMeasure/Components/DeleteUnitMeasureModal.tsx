// src/Modules/UnitMeasure/Components/DeleteUnitMeasureModal.tsx
import { toast } from "react-toastify";
import { ModalBase } from "../../../Components/Modals/ModalBase";
import { useDeleteUnitMeasure } from "../Hooks/UnitMeasureHooks";
import type { Unit } from "../Models/unit";
import { useState } from "react";

type Props = {
  unit: Unit;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const DeleteUnitMeasureModal = ({ unit, open, onClose, onSuccess }: Props) => {
  const mutation = useDeleteUnitMeasure();
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    try {
      await mutation.mutateAsync(unit.Id);
      toast.success("¡Unidad eliminada!", { position: "top-right", autoClose: 3000 });
      onClose?.();
      onSuccess?.();
    } catch (err) {
      console.error("Error eliminando la unidad:", err);
      toast.error("No se pudo eliminar la Unidad de Medida", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const text = 'confirmar'

  const canDelete = confirmText.trim().toLowerCase() === text.trim().toLowerCase();

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      panelClassName="w-full max-w-xl !p-0 overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <h3 className="text-xl font-bold text-[#091540]">Eliminar Unidad de Medida</h3>
      </div>

      {/* Body */}
      <div className="p-6 bg-white space-y-4">
        <div className="bg-gray-50 p-3">
          <p className="text-sm text-[#091540]">
            Estás a punto de <span className="font-semibold text-red-600">Desactivar</span> la unidad:
          </p>
          <p className="mt-1 text-base font-semibold break-words">{unit.Name?? "-"}</p>
        </div>

        <div className="p-3 border border-red-200 bg-red-50 rounded">
          <p className="text-sm text-red-700">
            Esta acción solamente desactivara la unidad de medida. No será completamente eliminada para no dañar registros en la Base de Datos.
          </p>
        </div>

        {/* Confirmación por texto (opcional pero recomendable) */}
        <label className="grid gap-1">
          <span className="text-sm text-gray-700">
            Escribe <span className="font-semibold">{text}</span> para desactivar
          </span>
          <input
            className="w-full px-4 py-2 border-[#091540]/40 border focus:outline-none focus:ring-2 focus:ring-[#1789FC]"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={`Escribe "${text}"`}
          />
        </label>

        {/* Acciones */}
        <div className="mt-2 flex justify-end items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canDelete || mutation.isPending}
            onClick={handleDelete}
            className="h-10 px-5 bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {mutation.isPending ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default DeleteUnitMeasureModal;
