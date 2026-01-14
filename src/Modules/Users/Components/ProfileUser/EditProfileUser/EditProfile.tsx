import React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";

import { useGetUserProfile, useUpdateUserProfile } from "../../../Hooks/UsersHooks";
import { EditProfileSchema, type EditProfileInput } from "../../../schemas/EditProfileSchema";
import ConfirmActionModal from "../../../../../Components/Modals/ConfirmActionModal";
import { updateUserMeInitialState } from "../../../Models/User";
import PhoneField from "../../../../../Components/PhoneNumber/PhoneField";

const EditProfile = () => {
  const { UserProfile } = useGetUserProfile();
  const updateProfile = useUpdateUserProfile();

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const pendingValuesRef = React.useRef<EditProfileInput | null>(null);

  const form = useForm({
    defaultValues: updateUserMeInitialState, // { Birthdate: undefined, PhoneNumber:'', Address:'' }
    validators: { onChange: EditProfileSchema },
    onSubmit: async ({ value }) => {
      pendingValuesRef.current = value;
      setOpenConfirm(true);
    },
  });

  // Cargar valores reales del usuario al form (si no, arranca vacío)
  React.useEffect(() => {
    if (!UserProfile) return;

    form.reset({
      Birthdate: UserProfile.Birthdate ? new Date(UserProfile.Birthdate) : undefined,
      PhoneNumber: UserProfile.PhoneNumber ?? "",
      Address: UserProfile.Address ?? "",
    });
  }, [UserProfile]);

  // Construir PATCH: solo lo que se tocó (dirty) y sin mandar strings vacíos
  const buildPatch = (values: EditProfileInput) => {
    const patch: Partial<EditProfileInput> = {};

    const meta = form.state.fieldMeta as Record<string, any>;

    for (const [key, m] of Object.entries(meta)) {
      if (!m?.isDirty) continue;

      const v = (values as any)[key];

      // No enviar vacíos ni undefined
      if (v === "" || v === undefined || v === null) continue;

      // Para Date, validá que sea Date real
      if (v instanceof Date && Number.isNaN(v.getTime())) continue;

      (patch as any)[key] = v;
    }

    return patch;
  };

  const handleConfirmUpdate = async () => {
    if (!pendingValuesRef.current) return;

    try {
      const patch = buildPatch(pendingValuesRef.current);

      if (Object.keys(patch).length === 0) {
        toast.info("No hay cambios para guardar.", { position: "top-right", autoClose: 2500 });
        setOpenConfirm(false);
        pendingValuesRef.current = null;
        return;
      }

      await updateProfile.mutateAsync(patch as any);

      // Volvé a “sin cambios”
      form.reset(form.state.values);

      toast.success("¡Actualización exitosa!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      toast.error("¡Error al actualizar el perfil!", { position: "top-right", autoClose: 3000 });
    } finally {
      setOpenConfirm(false);
      pendingValuesRef.current = null;
    }
  };

  const handleCancelUpdate = () => {
    setOpenConfirm(false);
    toast.info("¡Actualización cancelada!", { position: "top-right", autoClose: 2500 });
    pendingValuesRef.current = null;
  };

  return (
    <div className="bg-[#F9F5FF] flex flex-col content-center w-full max-w-6xl mx-auto px-4 md:px-25 pt-24 pb-20 gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#091540]">Editar información de usuario</h1>
        <h3 className="text-[#091540]/70 text-md">Modifique los datos de su perfil</h3>
        <div className="border-b border-dashed border-gray-300 p-2"></div>
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col items-center border border-gray-200 gap-4 shadow-xl rounded-sm bg-[#F9F5FF] p-6">
        <div className="p-3">
          <h2 className="md:text-3xl font-bold text-[#091540] text-center gap-4">Edición de Perfil</h2>
          <hr className="border-t-2 border-dashed border-[#091540]" />
        </div>

        <h2 className="md:text-xl font-bold text-[#091540] text-center gap-4">
          {UserProfile?.Name} {UserProfile?.Surname1} {UserProfile?.Surname2}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="w-full max-w-md p-2 flex flex-col gap-6"
        >
          {/* Birthdate */}
          <form.Field name="Birthdate">
            {(field) => (
              <>
                <input
                  type="date"
                  value={
                    field.state.value instanceof Date && !Number.isNaN(field.state.value.getTime())
                      ? field.state.value.toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    field.handleChange(val ? new Date(val) : undefined);
                  }}
                  className="input-base"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </>
            )}
          </form.Field>

          {/* PhoneNumber */}
          <form.Field name="PhoneNumber">
            {(field) => (
              <>
                <PhoneField
                  value={field.state.value ?? ""}
                  onChange={(val) => field.handleChange(val ?? "")}
                  defaultCountry="CR"
                  error={
                    field.state.meta.isTouched && field.state.meta.errors[0]
                      ? String((field.state.meta.errors[0] as any)?.message ?? field.state.meta.errors[0])
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

          {/* Address */}
          <form.Field name="Address">
            {(field) => (
              <>
                <span>Dirección</span>
                <textarea
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="input-base"
                  placeholder={UserProfile?.Address ?? "Dirección"}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </>
            )}
          </form.Field>

          <div className="flex justify-end gap-4">
            <form.Subscribe selector={(s) => [s.isSubmitting, s.isDirty]}>
              {([isSubmitting, isDirty]) => (
                <button
                  type="submit"
                  className="bg-[#091540] hover:bg-blue-600 text-white flex justify-center items-center font-bold w-25 disabled:opacity-50 px-4 py-2"
                  disabled={!isDirty || updateProfile.isPending}
                >
                  {isSubmitting || updateProfile.isPending ? "..." : "Confirmar"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>

      {openConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={handleCancelUpdate}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ConfirmActionModal onConfirm={handleConfirmUpdate} onCancel={handleCancelUpdate} onClose={handleCancelUpdate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
