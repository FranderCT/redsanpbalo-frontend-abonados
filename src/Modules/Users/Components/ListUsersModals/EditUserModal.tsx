// Components/EditUserModal.tsx
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useUpdateUser, useGetAllRoles } from "../../Hooks/UsersHooks"; // 👈 trae roles
import type { User } from "../../Models/User";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";

type Props = {
  user: User;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function EditUserModal({ user, open, onClose, onSuccess }: Props) {
  const updateUserMutation = useUpdateUser();
  const { roles } = useGetAllRoles(); // [{ Id, Rolname }]

  const initialRoleIds =
    (Array.isArray((user as any)?.Roles) ? (user as any).Roles.map((r: any) => r.Id) : undefined) ??
    (Array.isArray((user as any)?.roleIds) ? (user as any).roleIds : []) ??
    [];

  const form = useForm({
    defaultValues: {
      PhoneNumber: user.PhoneNumber ?? "",
      Nis: user.Nis ?? "",
      Address: user.Address ?? "",
      roleIds: initialRoleIds as number[], // 👈 importante
      IsActive: user.IsActive ?? true,
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
    <ModalBase open={open} onClose={onClose} panelClassName="w-full max-w-xl !p-0 max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-5 text-[#091540] flex-shrink-0">
        <h3 className="text-xl font-bold text-[#091540]">Editar usuario</h3>
      </div>

      {/* Body */}
<div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-6 py-4">
        {/* Información del usuario */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Información del usuario</h4>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3">
              <dt className="text-[11px] uppercase tracking-wide text-gray-500">Nombre completo</dt>
              <dd className="mt-1 text-sm text-[#091540] break-words">
                {`${user?.Name ?? ""} ${user?.Surname1 ?? ""} ${user?.Surname2 ?? ""}`.trim() || "—"}
              </dd>
            </div>
            <div className="bg-gray-50 p-3">
              <dt className="text-[11px] uppercase tracking-wide text-gray-500">Correo electrónico</dt>
              <dd className="mt-1 text-sm text-[#091540] break-words">{user?.Email || "—"}</dd>
            </div>
            <div className="bg-gray-50 p-3">
              <dt className="text-[11px] uppercase tracking-wide text-gray-500">Cédula</dt>
              <dd className="mt-1 text-sm text-[#091540] break-words">{user?.IDcard || "—"}</dd>
            </div>
            <div className="bg-gray-50 p-3">
              <dt className="text-[11px] uppercase tracking-wide text-gray-500">NIS</dt>
              <dd className="mt-1 text-sm text-[#091540] break-words">{user?.Nis || "—"}</dd>
            </div>
          </dl>
        </div>

        {/* Formulario */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="grid gap-4"
        >
<form.Field name="Nis">
  {(field) => (
    <>
      <input
        type="text"
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder="Ingresa el NIS"
        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
        required
      />
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <p className="text-sm text-red-500 mt-1">
          {(field.state.meta.errors[0] as any)?.message ??
            String(field.state.meta.errors[0])}
        </p>
      )}
    </>
  )}
</form.Field>

          <form.Field name="PhoneNumber">
            {(field) => (
              <>
              <PhoneField
                  value={field.state.value}            
                  onChange={(val) => field.handleChange(val ?? "")} 
                  defaultCountry="CR"
                  required
                  error={
                  field.state.meta.isTouched && field.state.meta.errors[0]
                  ? String(field.state.meta.errors[0])
                   : undefined
                  }
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </>
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

          {/* ===== Roles ===== */}
          <form.Field name="roleIds">
            {(field) => {
              const selectedIds: number[] = field.state.value ?? [];
              const notSelected = roles?.filter((r: any) => !selectedIds.includes(r.Id)) ?? [];

              const removeRole = (id: number) =>
                field.handleChange(selectedIds.filter((x) => x !== id));
              const addRole = (id: number) =>
                field.handleChange(Array.from(new Set([...selectedIds, id])));
              const clearAll = () => field.handleChange([]);

              return (
                <div className="grid gap-2">
                  <span className="text-sm text-gray-700">Roles</span>

                  {/* Chips seleccionados */}
                  <div className="flex flex-wrap gap-2">
                    {selectedIds.length === 0 && <span className="text-xs text-gray-500">Sin roles asignados.</span>}
                    {selectedIds.map((id) => {
                      const r = roles?.find((x: any) => x.Id === id);
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-2 border px-3 py-1 text-sm bg-gray-50"
                        >
                          {r?.Rolname ?? `ID ${id}`}
                          <button
                            type="button"
                            onClick={() => removeRole(id)}
                            className="text-gray-500 hover:text-red-600"
                            title="Quitar rol"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>

                  {/* Agregar más roles (select simple que inserta y se resetea) */}
                  <div className="flex items-center gap-2">
                    <select
                      className="w-98.5 px-4 py-2 bg-gray-50 border"
                      defaultValue=""
                      onChange={(e) => {
                        const v = e.currentTarget.value;
                        if (!v) return;
                        addRole(Number(v));
                        e.currentTarget.value = ""; // reset
                      }}
                    >
                      <option value="" disabled>
                        {notSelected.length ? "Agregar rol…" : "No hay más roles disponibles"}
                      </option>
                      {notSelected.map((r: any) => (
                        <option key={r.Id} value={String(r.Id)}>
                          {r.Rolname}
                        </option>
                      ))}
                    </select>

                    {selectedIds.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAll}
                        className="h-10 px-3 border bg-white hover:bg-gray-50"
                        title="Quitar todos"
                      >
                        Quitar todos
                      </button>
                    )}
                  </div>

                  {/* Errores */}
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      {(field.state.meta.errors[0] as any)?.message ??
                        String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>
          {/* ===== Fin Roles ===== */}

          <form.Field name="IsActive">
            {(field) => (
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <span className="text-sm text-gray-700">Activo</span>

                {/* Toggle */}
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={!!field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5"></div>
                </div>

                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>


          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <div className="mt-2 flex justify-end items-center gap-2">
                <button type="button" onClick={onClose} className="h-10 px-4 bg-gray-200 hover:bg-gray-300">
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
