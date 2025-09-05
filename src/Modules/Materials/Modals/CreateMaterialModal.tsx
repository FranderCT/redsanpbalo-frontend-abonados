import { useState, useEffect } from "react";
import MaterialModal from "./MaterialModal";
import CreateMaterialForm from "../Pages/CreateMaterialForm";


const CreateMaterialModal = () => {
  const [open, setOpen] = useState(false);

  // Cerrar con tecla ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        Registrar Material
      </button>

      <MaterialModal isOpen={open} onClose={() => setOpen(false)}>
        <CreateMaterialForm onSuccess={() => setOpen(false)} />
      </MaterialModal>
    </div>
  );
};

export default CreateMaterialModal;
