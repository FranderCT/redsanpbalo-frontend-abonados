    // ./Table/UpdateUserModal.tsx
    import { Modal } from 'react-responsive-modal';

    type MyModalProps = {
    open: boolean;
    onClose: () => void;
    onCancel: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    };

    const UpdateUserModal = ({
    open, onClose, onCancel, onConfirm, title = "Confirmar", message = "¿Aplicar cambios?",
    }: MyModalProps) => {
    return (
        <Modal
        open={open}
        onClose={onClose}
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
            <button onClick={onCancel} className="px-4 py-2 rounded border border-gray-300 text-[#091540]">Cancelar</button>
            <button onClick={onConfirm} className="px-4 py-2 rounded bg-[#091540] text-white">Confirmar</button>
            </div>
        </div>
        </Modal>
    );
    };

    export default UpdateUserModal;
