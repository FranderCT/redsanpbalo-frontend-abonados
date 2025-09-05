// ./Table/AddUserModal.tsx

import Modal from "react-responsive-modal";
import RegisterAbonados from "../../../../Auth/Pages/RegisterAbonados";


type MyModalProps = {
  open: boolean;
  onClose: () => void;
};

const AddUserModal = ({ open, onClose }: MyModalProps) => {
  
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      center
      blockScroll
      focusTrapped
      showCloseIcon={false}
      classNames={{
        root: "z-[10000]",
        overlay: "bg-black/50",
        modal: "rounded-2xl p-0 shadow-2xl w-[100%]  ring-1 ring-gray-200",
      }}
      styles={{ modal: { padding: 0 } }}
    >
      <RegisterAbonados />
    </Modal>
  );
};

export default AddUserModal;
 