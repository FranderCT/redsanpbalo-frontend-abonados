import React from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import ConfirmActionModal from "../../../Components/Modals/ConfirmActionModal";
import { ChangePasswordSchema } from "../../Auth/schemas/ChangePasswordSchema";
import { changePasswordInitialState } from "../../Auth/Models/changePassword";

// import { useChangePassword } from "../../Hooks/AuthHooks"; // si ya tienes hook real

type EditPayload = typeof changePasswordInitialState;

const ChangePassword = () => {
  // const changePasswordMutation = useChangePassword();
  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const pendingValuesRef = React.useRef<EditPayload | null>(null);

  const form = useForm({
    defaultValues: changePasswordInitialState,
    validators: { onChange: ChangePasswordSchema },
    onSubmit: async ({ value }) => {
      if (value.NewPassword !== value.ConfirmPassword) {
        toast.error("Las contraseñas no coinciden", { position: "top-right", autoClose: 3000 });
        return;
      }
      pendingValuesRef.current = value as EditPayload;
      setOpenConfirm(true);
    },
  });

  const handleConfirmUpdate = async () => {
    if (!pendingValuesRef.current) return;
    try {
      // await changePasswordMutation.mutateAsync(pendingValuesRef.current);

      toast.success("¡Contraseña actualizada con éxito!", { position: "top-right", autoClose: 2500 });

      // Opcional: invalidar credenciales locales antes de enviar al login
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      // Si usas cookies HTTP-only, el backend debería invalidarlas.
      toast.info("Tu sesión ha finalizado. Inicia sesión con tu nueva contraseña.", {
        position: "top-right",
        autoClose: 3500,
      });

      form.reset();

      // ➜ Redirigir a login
      navigate({ to: "/login" });
    } catch (err) {
      toast.error("¡Error al actualizar la contraseña!", { position: "top-right", autoClose: 3000 });
    } finally {
      setOpenConfirm(false);
      pendingValuesRef.current = null;
    }
  };

  const handleCancelUpdate = () => {
    setOpenConfirm(false);
    pendingValuesRef.current = null;
    toast.info("Actualización cancelada", { position: "top-right", autoClose: 3000 });
  };

  return (
    <div className="bg-[#F9F5FF] flex flex-col content-center w-full max-w-6xl mx-auto px-4 md:px-25 pt-24 pb-20 gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#091540]">Cambiar contraseña</h1>
        <h3 className="text-[#091540]/70 text-md">Actualice aquí la contraseña de su cuenta</h3>
        <div className="border-b border-dashed border-gray-300 p-2"></div>
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col items-center border border-gray-200 gap-4 shadow-xl rounded-sm bg-[#F9F5FF] p-6">
        <div className="p-3">
          <h2 className="md:text-3xl font-bold text-[#091540] text-center gap-4">
            Cambiar su contraseña
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
          {/* Contraseña actual */}
          <form.Field name="OldPassword">
            {(field) => (
              <>
                <input
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ingrese su contraseña actual"
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

          {/* Nueva contraseña */}
          <form.Field name="NewPassword">
            {(field) => (
              <>
                <input
                  className="input-base"
                  placeholder="Ingrese su nueva contraseña"
                  value={field.state.value}
                  type="password"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </>
            )}
          </form.Field>

          {/* Confirmación nueva contraseña */}
          <form.Field name="ConfirmPassword">
            {(field) => (
              <>
                <input
                  className="input-base"
                  placeholder="Confirme su nueva contraseña"
                  value={field.state.value}
                  type="password"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </>
            )}
          </form.Field>

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting, s.isDirty]}>
            {([canSubmit, isSubmitting, isDirty]) => (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#091540] hover:bg-blue-600 text-white flex justify-center items-center font-bold w-25 rounded disabled:opacity-50 px-4 py-2"
                  disabled={!canSubmit || !isDirty /* || changePasswordMutation?.isPending */}
                >
                  {isSubmitting /* || changePasswordMutation?.isPending */ ? "..." : "Confirmar"}
                </button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </div>

      {/* Modal de confirmación */}
      {openConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={handleCancelUpdate}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ConfirmActionModal
              description="¿Deseas actualizar tu contraseña? Esto cerrará tus sesiones activas."
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

export default ChangePassword;
