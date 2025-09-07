import ConfirmActionModal from '../../../Components/Modals/ConfirmActionModal';

const InhabilityUserModal = () => {
  return (
    <div className="min-h-screen grid place-items-center bg-neutral-100 p-6">
        <ConfirmActionModal
        title="¿Inhabilitar usuaio?"
        description="El usuario quedará desactivado y no podrá acceder al sistema"
        onCancel={() => console.log('cancel')}
        onConfirm={() => console.log('delete')}
        />
    </div>
    );
}

export default InhabilityUserModal