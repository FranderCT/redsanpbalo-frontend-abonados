import { useState } from "react";

const ModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6 flex flex-col items-center">
      {/* Botón para abrir el modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        Abrir Modal
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <h2 className="text-lg font-bold mb-4">Modal sin props</h2>
            <p className="mb-4">
              Este modal no recibe props, se maneja todo dentro del mismo componente.
            </p>

            <button
              onClick={() => setIsOpen(false)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalExample;
