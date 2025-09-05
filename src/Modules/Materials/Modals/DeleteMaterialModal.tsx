import { useDeleteMaterial } from "../Hooks/MaterialHooks";
import MaterialModal from "./MaterialModal";

type Props = {
  id: number | null;
  onClose: () => void;
};

const DeleteMaterialModal = ({ id, onClose }: Props) => {
  const del = useDeleteMaterial();
  const isOpen = id !== null;

  const handleDelete = async () => {
    if (id == null) return;
    try {
      await del.mutateAsync(id);   // DELETE /material/{id}
      onClose();                   // cerrar modal
    } catch (e) {
      console.error("Error al eliminar:", e);
    }
  };

  return (
    <MaterialModal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#091540]">Eliminar material</h2>
        <p className="text-sm text-gray-700">
          ¿Seguro que deseas eliminar este material? 
        </p>

        <div className="flex gap-3 pt-2">
         
          <button
            onClick={handleDelete}
            disabled={del.isPending}
            className="flex-1 py-2 font-semibold rounded 
                       bg-red-600 text-white shadow 
                       hover:bg-red-700 disabled:opacity-60 transition"
          >
            {del.isPending ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </MaterialModal>
  );
};

export default DeleteMaterialModal;
