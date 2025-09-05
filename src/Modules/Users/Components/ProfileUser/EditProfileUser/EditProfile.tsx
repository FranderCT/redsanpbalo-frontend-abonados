import { useForm } from "@tanstack/react-form";
import { EditUserInitialState } from "../../../Models/EditUser";
import { useGetUserProfile, useUpdateUserProfile } from "../../../Hooks/UsersHooks";
import type { UserProfile } from "../../../Models/User";
import { useNavigate } from "@tanstack/react-router";
import UpdateWarning from "./UpdateWarning";
import { useRef, useState } from "react";
import { EditProfileSchema } from "../../../schemas/EditProfileSchema";
import { toast } from "react-toastify";
import CancelEditWarning from "./UpdateCancelWarning";


type Props = { User?: UserProfile };
type EditPayload = typeof EditUserInitialState;

const EditProfile = ({ User }: Props) => {
  const {UserProfile} = useGetUserProfile();
  const updateProfile = useUpdateUserProfile();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false); 
  const [pendingValues, setPendingValues] = useState<EditPayload | null>(null);

  const form = useForm({
    defaultValues: EditUserInitialState,
    validators: {
          onChange: EditProfileSchema,
      },
    onSubmit: async ({ value }) => {
      setPendingValues(value);
      setConfirmOpen(true);
    },
  });

  const handleConfirm = async () => {
    if (!pendingValues) return;
    try {
      console.log(pendingValues);
      await updateProfile.mutateAsync(pendingValues);
      toast.success('¡Actualización exitosa!', { position: 'top-right', autoClose: 3000 });
      setConfirmOpen(false);
      setPendingValues(null);
      navigate({ to: "/dashboard/users/profile" });
    } catch (e) {
      console.log(pendingValues);
      toast.error('¡Actualización denegada!', { position: 'top-right', autoClose: 3000 });
      console.error("Error al actualizar el usuario", e);
      setConfirmOpen(false);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingValues(null);
    form.reset();
  };

  return (
    <div className="bg-[#F9F5FF] flex flex-col content-center w-full max-w-6xl mx-auto px-4 md:px-25 pt-24 pb-20 gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#091540]">Editar información del perfil</h1>
        <h3 className="text-[#091540]/70 text-md">Modifique aquí los datos de su perfil</h3>
        <div className="border-b border-dashed border-gray-300 p-2"></div>
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col items-center border border-gray-200 gap-4 shadow-xl rounded-sm bg-[#F9F5FF] p-6" >
        

        {/* <img
          src="\src\Modules\Auth\Assets\g28.png"
          //className="w- h- rounded-full object-cover border border-gray-200"
        /> */}
        <div className="p-3">
          <h2 className="md:text-3xl font-bold text-[#091540] text-center gap-4">
            Edición de Perfil
          </h2>
          <hr className="border-t-2 border-dashed border-[#091540]" />
        </div>
        
        <h2 className="md:text-xl font-bold text-[#091540] text-center gap-4">
          {UserProfile?.Name} {UserProfile?.Surname1} {UserProfile?.Surname2}
        </h2>
        {/* <a href="/profile" className="flex flex-row items-center gap-2 text-[#091540]">
          Editar foto de perfil
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 17.25V21h3.75L18.81 8.94l-3.75-3.75L3 17.25z" stroke="#091540" />
            <path d="M14.06 5.19l3.75 3.75" stroke="#091540" />
          </svg>
        </a> */}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="w-full max-w-md p-2 flex flex-col gap-6"
        >
          {/* ProfilePhoto - archivo NO controlado */}
          {/* <form.Field name="ProfilePhoto">
            {(field) => (
              <>
                <input
                  type="file"
                  className="input-base"
                  onChange={(e) => {
                    const file = (e.target.files && e.target.files[0]) || null;
                    field.handleChange(file as any); // ajusta según tu API: File | string
                  }}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
              </>
            )}
          </form.Field> */}

          {/* Birthdate */}
          <form.Field name="Birthdate">
            {(field) => (
              <>
                <input
                  type="date"
                  placeholder={UserProfile?.Birthdate}
                  value={
                    field.state.value instanceof Date
                      ? field.state.value.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => field.handleChange(e.target.value ? new Date(e.target.value) : undefined)}
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

          {/* PhoneNumber */}
          <form.Field name="PhoneNumber">
            {(field) => (
              <>
                <input
                  type="text"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value.trim() === "" ? undefined : e.target.value)}
                  className="input-base"
                  placeholder={UserProfile?.PhoneNumber}
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

          {/* Address */}
          <form.Field name="Address">
            {(field) => (
              <>
                <input
                  type="text"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value.trim() === "" ? undefined : e.target.value)}
                  className="input-base"
                  placeholder={UserProfile?.Address}
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
                  className="bg-[#091540] hover:bg-blue-600 text-white flex justify-center items-center font-bold w-25 rounded disabled:opacity-50 px-4 py-2"
                  disabled={!canSubmit || !isDirty || updateProfile.isPending}
                >
                  {isSubmitting || updateProfile.isPending ? "..." : "Confirmar"}
                </button>
              )}
            </form.Subscribe>

            <button
              type="button"
              onClick={() => setCancelOpen(true)}           // <- antes navegabas directo
              className="hover:bg-[#F6132D] text-[#F6132D] hover:text-white ring font-bold w-25 p-2 rounded-sm"
            >
              Cancelar
            </button>
          </div>
          
        </form>
        <CancelEditWarning
        open={cancelOpen}
        onStay={() => setCancelOpen(false)}           // seguir editando
        onExit={() => {                               // salir sin guardar
          form.reset();                               // vuelve a defaults
          setPendingValues(null);
          setCancelOpen(false);
          navigate({ to: "/dashboard/users/profile" });
        }}
      />
              {/* Modal de confirmación */}
        <UpdateWarning
            open={confirmOpen}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            title="Confirmar cambios"
            message="¿Deseas aplicar los cambios a tu perfil?"
            confirmText="Sí, actualizar"
            cancelText="No, volver"
          />
      </div>
    </div>
  );
};

export default EditProfile;
