// Components/GetInfoUserModal.tsx
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useGetUserById } from "../../Hooks/UsersHooks";
import type { User } from "../../Models/User";


type Props = {
  user: User;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function GetInfoUserModal({
  user: selectedUser,
  open,
  onClose,
  onSuccess,
}: Props) {
  const { user, isLoading, error } = useGetUserById(selectedUser.Id);

  return (
    <ModalBase
      open={open}
      onClose={() => {
        onClose();
        onSuccess?.();
      }}
      panelClassName="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <h3 className="text-xl font-bold text-[#091540]">
          Información del usuario
        </h3>
        <span>Aquí puedes ver toda la información del Usuario</span>
      </div>

      {/* Body */}
      <div className="p-6 bg-white">
        {isLoading && (
          <div className="text-sm text-gray-600">Cargando información…</div>
        )}

        {error && !isLoading && (
          <div className="text-sm text-red-600">
            No se pudo cargar la información del usuario.
          </div>
        )}

        {!isLoading && !error && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3">
              <dt className="text-[11px] uppercase text-gray-500">ID Interno</dt>
              <dd className="mt-1 text-sm text-[#091540]">{user?.Id}</dd>
            </div>

            <div className="bg-gray-50 p-3">
              <dt className="text-[11px] uppercase text-gray-500">Cédula</dt>
              <dd className="mt-1 text-sm text-[#091540]">
                {user?.IDcard || "—"}
              </dd>
            </div>

            <div className="bg-gray-50 p-3 sm:col-span-2">
              <dt className="text-[11px] uppercase text-gray-500">
                Nombre completo
              </dt>
              <dd className="mt-1 text-sm text-[#091540] break-words">
                {`${user?.Name ?? ""} ${user?.Surname1 ?? ""} ${
                  user?.Surname2 ?? ""
                }`.trim() || "—"}
              </dd>
            </div>

            <div className="bg-gray-50 p-3">
              <dt className="text-[11px] uppercase text-gray-500">NIS</dt>
              <dd className="mt-1 text-sm text-[#091540]">
                {user?.Nis && user.Nis.length > 0 ? user.Nis.join(", ") : "—"}
              </dd>
            </div>

            <div className="bg-gray-50 p-3">
              <dt className="text-[11px] uppercase text-gray-500">
                Correo electrónico
              </dt>
              <dd className="mt-1 text-sm text-[#091540] break-words">
                {user?.Email || "—"}
              </dd>
            </div>

            <div className="bg-gray-50 p-3">
              <dt className="text-[11px] uppercase text-gray-500">Teléfono</dt>
              <dd className="mt-1 text-sm text-[#091540]">
                {user?.PhoneNumber || "—"}
              </dd>
            </div>

            <div className="bg-gray-50 p-3">
              <dt className="text-[11px] uppercase text-gray-500">
                Fecha de nacimiento
              </dt>
              <dd className="mt-1 text-sm text-[#091540]">
                {user?.Birthdate
                  ? new Date(user.Birthdate).toLocaleDateString("es-CR")
                  : "—"}
              </dd>
            </div>

            {/* Estado */}
            <div className="bg-gray-50 p-3">
              <dt className="text-[11px] uppercase text-gray-500">Estado</dt>
              <dd
                className={`mt-1 text-sm font-semibold ${
                  user?.IsActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {user?.IsActive ? "Activo" : "Inactivo"}
              </dd>
            </div>

            <div className="bg-gray-50 p-3 sm:col-span-1">
                <dt className="text-[11px] uppercase text-gray-500">Roles</dt>
                <dd className="mt-1 text-sm text-[#091540]">
                    {user?.Roles?.map((r) => r.Rolname).join(", ") || "—"}
                </dd>
            </div>


            {/* Dirección al final */}
            <div className="bg-gray-50 p-3 sm:col-span-2">
              <dt className="text-[11px] uppercase text-gray-500">Dirección</dt>
              <dd className="mt-1 text-sm text-[#091540] whitespace-pre-wrap">
                {user?.Address || "—"}
              </dd>
            </div>
          </dl>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 bg-gray-200 hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
