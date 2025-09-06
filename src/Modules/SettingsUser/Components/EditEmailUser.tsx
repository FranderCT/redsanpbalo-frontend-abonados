import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";

import type { UserProfile } from "../../Users/Models/User";
import {  useUpdateUserEmail } from "../../Users/Hooks/UsersHooks";
import { EmailUserInitialState } from "../Models/EmailUser";
import { EditEmailUserSchema } from "../schemas/EditEmailUserSchema";

type Props = { User?: UserProfile };
type EditPayload = typeof EmailUserInitialState;

const EditEmailUser = ({ User }: Props) => {

  const updateProfile = useUpdateUserEmail();
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: EmailUserInitialState,
    validators: {
          onChange: EditEmailUserSchema,
      },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  });



  return (
    <div className="bg-[#F9F5FF] flex flex-col content-center w-full max-w-6xl mx-auto px-4 md:px-25 pt-24 pb-20 gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#091540]">Editar email de usuario</h1>
        <h3 className="text-[#091540]/70 text-md">Modifique aquí los datos de su perfil</h3>
        <div className="border-b border-dashed border-gray-300 p-2"></div>
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col items-center border border-gray-200 gap-4 shadow-xl rounded-sm bg-[#F9F5FF] p-6" >
        
        <div className="p-3">
          <h2 className="md:text-3xl font-bold text-[#091540] text-center gap-4">
            Editar correo electronico
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
          {/* Email */}
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
          {/* Email */}
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
                  className="bg-[#091540] hover:bg-blue-600 text-white flex justify-center items-center font-bold w-25 rounded disabled:opacity-50 px-4 py-2"
                  disabled={!canSubmit || !isDirty || updateProfile.isPending}
                >
                  {isSubmitting || updateProfile.isPending ? "..." : "Confirmar"}
                </button>
              )}
            </form.Subscribe>

            <button
              type="button"
              onClick={() => navigate({ to: "/dashboard/users/profile" })}
              className="hover:bg-[#F6132D] text-[#F6132D] hover:text-white ring font-bold w-25 p-2 rounded-sm"
            >
              Cancelar
            </button>
          </div>
          
        </form>
        {/* Modal de confirmación */}
        
      </div>
    </div>
  );
};

export default EditEmailUser;
