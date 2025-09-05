    import { Modal } from 'react-responsive-modal';

    type Props = {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;

    };

    const UpdateWarning = ({
    open,
    onConfirm,
    onCancel,
    title = "¿Confirmar cambios?",
    message = "Esta acción actualizará tu perfil.",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    }: Props) => {
    return (
        <Modal
        open={open}
        onClose={onCancel}
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
            <button
                onClick={onConfirm}
                className="px-4 py-2 rounded bg-[#091540] text-white"
            >
                {confirmText}
            </button>
            <button
                onClick={onCancel}
                className="px-4 py-2 rounded border border-gray-300 text-[#091540]"
            >
                {cancelText}
            </button>
            </div>
        </div>
        </Modal>
    );
    };

    export default UpdateWarning;
