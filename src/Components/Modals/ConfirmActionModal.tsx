import React from "react";

type Props = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
};

export default function ConfirmActionModal({
  title = "¿Confirmar cambios?",
  description = "¿Está seguro de querer actualizar su información?",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  onClose,
}: Props) {
  const labelId = React.useId();
  const descId = React.useId();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      aria-describedby={descId}
      className="relative w-[300px] bg-white p-7 shadow-2xl flex flex-col items-center justify-center gap-5 select-none border border-gray-200"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={() => onClose?.()}
        aria-label="Close"
        className="absolute right-5 top-5 inline-flex items-center justify-center p-1 text-gray-400 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
      >
        <svg height="20" viewBox="0 0 384 512" className="h-5 w-5 fill-current">
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
      </button>

      {/* Content */}
      <div className="flex w-full flex-col gap-1">
        <p id={labelId} className="text-[20px] text-[#091540] font-bold ">
          {title}
        </p>
        <p id={descId} className="text-sm font-light text-[#091540]">
          {description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex w-full items-center justify-center gap-2">
         <button
          type="button"
          onClick={() => onConfirm?.()}
          className="h-[35px] w-1/2 bg-[#68D89B] font-semibold text-white transition-colors hover:bg-[#57c58a] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-300"
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={() => onCancel?.()}
          className="h-[35px] w-1/2 bg-gray-200 font-semibold text-[#091540] transition-colors hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  );
}
