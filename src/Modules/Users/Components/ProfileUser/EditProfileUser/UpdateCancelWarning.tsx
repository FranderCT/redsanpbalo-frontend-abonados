// CancelEditWarning.tsx
import { Modal } from "react-responsive-modal";

type CancelEditWarningProps = {
  open: boolean;
  onExit: () => void;     // salir del editor / descartar cambios
  onStay: () => void;     // mantener edición (cerrar modal)
  title?: string;
  message?: string;
  exitText?: string;
  stayText?: string;
};

const CancelEditWarning = ({
  open,
  onExit,
  onStay,
  title = "¿Salir sin guardar?",
  message = "Estás a punto de salir del editor. Los cambios no guardados se perderán.",
  exitText = "Salir sin guardar",
  stayText = "Seguir editando",
}: CancelEditWarningProps) => {
  return (
    <Modal
      open={open}
      onClose={onStay}           // al cerrar por overlay/ESC, mantener edición
      center
      blockScroll
      focusTrapped
      showCloseIcon={false}
      classNames={{
        root: "z-[10000]",
        overlay: "bg-black/50",
        modal: "rounded-2xl p-0 shadow-2xl ring-1 ring-gray-200",
      }}
      styles={{ modal: { padding: 0 } }}
    >
      <div className="p-6 max-w-md">
        <h3 className="text-lg font-semibold text-[#091540] mb-2">{title}</h3>
        <p className="text-sm text-[#091540]/80 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          {/* Salir sin guardar (acción destructiva) */}
          <button
            onClick={onExit}
            className="px-4 py-2 rounded bg-[#F6132D] text-white hover:bg-red-700"
          >
            {exitText}
          </button>

          {/* Mantener edición */}
          <button
            onClick={onStay}
            className="px-4 py-2 rounded border border-gray-300 text-[#091540]"
          >
            {stayText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelEditWarning;
