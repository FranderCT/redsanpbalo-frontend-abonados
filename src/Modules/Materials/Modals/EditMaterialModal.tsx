// Components/EditMaterialModal.tsx

import type { Material } from "../Models/Material";
import MaterialModal from "./MaterialModal";
import EditMaterialForm from "../Pages/EditMaterialForm";




const EditMaterialModal = ({
  selected,
  onClose,
}: {
  selected: Material | null;
  onClose: () => void;
}) => {
  const isOpen = !!selected;
  return (
    <MaterialModal isOpen={isOpen} onClose={onClose}>
      {selected && (
        <EditMaterialForm material={selected} onSuccess={onClose} />
      )}
    </MaterialModal>
  );
};

export default EditMaterialModal;
