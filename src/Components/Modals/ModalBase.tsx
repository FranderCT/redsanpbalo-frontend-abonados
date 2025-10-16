import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnOutside?: boolean;   // default: true
  closeOnEsc?: boolean;       // default: true
  panelClassName?: string;    // override de estilos del panel
};

export function ModalBase({
  open,
  onClose,
  children,
  closeOnOutside = false,
  closeOnEsc = true,
  panelClassName,
}: ModalProps) {
  // Cerrar con ESC
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={() => { if (closeOnOutside) onClose(); }} // cerrar clic afuera
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-[300px] bg-white p-6 shadow-2xl flex flex-col gap-4 ${panelClassName ?? ""}`}
        onClick={(e) => e.stopPropagation()} // no cerrar al hacer clic dentro
      >
        {/* Botón X */}
        <button
          className="absolute top-5 right-5 p-1 rounded hover:bg-gray-100"
          onClick={onClose}
          aria-label="Cerrar"
          title="Cerrar"
        >
          <svg height="20" viewBox="0 0 384 512" className="fill-gray-400 hover:fill-black">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
}
