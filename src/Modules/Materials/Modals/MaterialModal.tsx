import type { ReactNode } from "react";


type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

const MaterialModal = ({ children, isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose} 
    >
      <div
        className="bg-white p-6  shadow-lg w-96 relative"
        onClick={(e) => e.stopPropagation()} 
      >
        {children}
       <button
          onClick={onClose}
          className="mt-3 w-full py-2 font-semibold 
                    text-red-600 border border-red-600 
                    rounded shadow-sm 
                    hover:bg-red-50 
                    transition-all duration-200"
        >
          Cerrar
        </button>


      </div>
    </div>
  );
};

export default MaterialModal;