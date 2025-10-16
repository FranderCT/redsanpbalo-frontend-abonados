import React from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useUpdateUserEmail } from "../../Users/Hooks/UsersHooks";
import { EmailUserInitialState } from "../Models/EmailUser";
import { EditEmailUserSchema } from "../schemas/EditEmailUserSchema";
import ConfirmActionModal from "../../../Components/Modals/ConfirmActionModal";
import { toast } from "react-toastify";

type EditPayload = typeof EmailUserInitialState;

const EditEmailUser = () => {
  const updateProfile = useUpdateUserEmail();
  const navigate = useNavigate();

  // Estado para modal y payload pendiente
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const pendingValuesRef = React.useRef<EditPayload | null>(null);

  const form = useForm({
    defaultValues: EmailUserInitialState,
    validators: { onChange: EditEmailUserSchema },
    onSubmit: async ({ value }) => {
      // Primero confirmamos con modal
      pendingValuesRef.current = value as EditPayload;
      setOpenConfirm(true);
    },
  });

  const handleConfirmUpdate = async () => {
  if (!pendingValuesRef.current) return;
  try {
    await updateProfile.mutateAsync(pendingValuesRef.current);
    toast.success("¡Actualización exitosa!", {
      position: "top-right",
      autoClose: 3000,
    });
    navigate({ to: "/dashboard/users/profile" });
  } catch (error) {
    toast.error("¡Error al actualizar el correo!", {
      position: "top-right",
      autoClose: 3000,
    });
  } finally {
    setOpenConfirm(false);
    pendingValuesRef.current = null;
  }
};

const handleCancelUpdate = () => {
  toast.info("¡Actualización cancelada!", {
    position: "top-right",
    autoClose: 3000,
  });
  setOpenConfirm(false);
  pendingValuesRef.current = null;
};

  return (
    <div className="bg-[#F9F5FF] flex flex-col content-center w-full max-w-6xl mx-auto px-4 md:px-25 pt-24 pb-20 gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#091540]">Editar información de usuario</h1>
        <h3 className="text-[#091540]/70 text-md">Modifique aquí su correo electrónico</h3>
        <div className="border-b border-dashed border-gray-300 p-2"></div>
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col items-center border border-gray-200 gap-4 shadow-xl rounded-sm bg-[#F9F5FF] p-6">
        <div className="p-3">
          <h2 className="md:text-3xl font-bold text-[#091540] text-center gap-4">
            Cambiar correo electrónico
          </h2>
          <hr className="border-t-2 border-dashed border-[#091540] m-1" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="w-full max-w-md p-2 flex flex-col gap-6"
        >
          {/* Email actual */}
          <form.Field name="OldEmail">
            {(field) => (
              <>
                <input
                  type="email"
                  placeholder="Correo electrónico actual"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="input-base"
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

          {/* Email nuevo */}
          <form.Field name="NewEmail">
            {(field) => (
              <>
                <input
                  type="email"
                  placeholder="Correo electrónico nuevo"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="input-base"
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

          <div className="flex justify-end gap-4">
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting, s.isDirty]}>
              {([canSubmit, isSubmitting, isDirty]) => (
                <button
                  type="submit"
                  className="bg-[#091540] hover:bg-blue-600 text-white flex justify-center items-center font-bold w-25 disabled:opacity-50 px-4 py-2"
                  disabled={!canSubmit || !isDirty || updateProfile.isPending}
                >
                  {isSubmitting || updateProfile.isPending ? "..." : "Confirmar"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>

      {/* Modal de confirmación (mismo patrón que en EditProfile) */}
      {openConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={handleCancelUpdate}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ConfirmActionModal
              description={
                pendingValuesRef.current
                  ? `Se actualizará tu correo de "${pendingValuesRef.current.OldEmail}" a "${pendingValuesRef.current.NewEmail}".`
                  : "Se actualizará tu correo."
              }
              confirmLabel="Confirmar"
              cancelLabel="Cancelar"
              onConfirm={handleConfirmUpdate}
              onCancel={handleCancelUpdate}
              onClose={handleCancelUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEmailUser;
