// Components/EditUserModal.tsx
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useUpdateUser } from "../../Hooks/UsersHooks";
import type { User } from "../../Models/User";

type Props = {
  user: User
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function EditUserModal({ user, open, onClose, onSuccess }: Props) {
  const updateUserMutation = useUpdateUser();

  const form = useForm({
    defaultValues: {
      PhoneNumber: user.PhoneNumber ?? "",
      Address: user.Address ?? "",
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateUserMutation.mutateAsync({ id: user.Id, data: value });
        toast.success("¡Usuario actualizado!", { position: "top-right", autoClose: 3000 });
        formApi.reset();
        onClose();
        onSuccess?.();
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? err?.message ?? "No se pudo actualizar el usuario.";
        toast.error(msg, { position: "top-right", autoClose: 3000 });
      }
    },
  });

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      // panel sin bordes redondeados
      panelClassName="w-full max-w-xl !p-0 overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <h3 className="text-xl font-bold text-[#091540]">Editar usuario</h3>
      </div>

      {/* Body */}
      <div className="p-6 bg-white">
        {/* Información del usuario (labels + valores en bloques grandes) */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Información del usuario</h4>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className=" bg-gray-50 p-3">
              <dt className="text-[11px] uppercase tracking-wide text-gray-500">Nombre completo</dt>
              <dd className="mt-1 text-sm text-[#091540] break-words">
                {`${user?.Name ?? ""} ${user?.Surname1 ?? ""} ${user?.Surname2 ?? ""}`.trim() || "—"}
              </dd>
            </div>

            <div className=" bg-gray-50 p-3">
              <dt className="text-[11px] uppercase tracking-wide text-gray-500">Correo electrónico</dt>
              <dd className="mt-1 text-sm text-[#091540] break-words">
                {user?.Email || "—"}
              </dd>
            </div>

            <div className=" bg-gray-50 p-3">
              <dt className="text-[11px] uppercase tracking-wide text-gray-500">Cédula</dt>
              <dd className="mt-1 text-sm text-[#091540] break-words">
                {user?.IDcard || "—"}
              </dd>
            </div>

            <div className=" bg-gray-50 p-3">
              <dt className="text-[11px] uppercase tracking-wide text-gray-500">NIS</dt>
              <dd className="mt-1 text-sm text-[#091540] break-words">
                {user?.Nis || "—"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Formulario de edición */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="grid gap-4"
        >
          <form.Field name="PhoneNumber">
            {(field) => (
              <label className="grid gap-1">
                <span className="text-sm text-gray-700">Número telefónico</span>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-[#1789FC]"
                  value={field.state.value}
                  inputMode="tel"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej. 8888-8888"
                />
              </label>
            )}
          </form.Field>

          <form.Field name="Address">
            {(field) => (
              <label className="grid gap-1">
                <span className="text-sm text-gray-700">Dirección</span>
                <textarea
                  className="w-full px-4 py-2 bg-gray-50 border min-h-[96px] resize-y focus:outline-none focus:ring-2 focus:ring-[#1789FC]"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Dirección del usuario"
                />
              </label>
            )}
          </form.Field>

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <div className="mt-2 flex justify-end items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-4 bg-gray-200 hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                >
                  {isSubmitting ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </div>
    </ModalBase>
  );
}
