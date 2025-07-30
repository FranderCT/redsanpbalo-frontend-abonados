import { formOptions, useForm } from "@tanstack/react-form"
import { UserInitialState } from "../Models/User"
import { createUser } from "../Services/AuthServices"
import { useCreateUser } from "../Hooks/AuthHooks";



const RegisterPrueba = () => {

    const createUser = useCreateUser();

    const formOpts = formOptions({
        defaultValues: UserInitialState,
    })

    const form = useForm({
        ...formOpts,
        onSubmit : async ({value}) => {
            await createUser.mutateAsync(value);
        }
    })
        

   return (
    <div className="min-h-screen w-full bg-[#D9DCD6] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#2F6690]">Registro</h2>
        <div className="h-1 bg-[#81C3D7] my-4 rounded"></div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          <form.Field name="nombre">
            {(field) => (
              <div>
                <label className="block text-[#16425B] font-medium mb-1">Nombre</label>
                <input
                  className="w-full border border-[#3A7CA5] rounded-lg p-2 text-[#16425B]"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="apellidos">
            {(field) => (
              <div>
                <label className="block text-[#16425B] font-medium mb-1">Apellidos</label>
                <input
                  className="w-full border border-[#3A7CA5] rounded-lg p-2 text-[#16425B]"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="cedula">
            {(field) => (
              <div>
                <label className="block text-[#16425B] font-medium mb-1">Cédula</label>
                <input
                  className="w-full border border-[#3A7CA5] rounded-lg p-2 text-[#16425B]"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="nis">
            {(field) => (
              <div>
                <label className="block text-[#16425B] font-medium mb-1">NIS</label>
                <input
                  className="w-full border border-[#3A7CA5] rounded-lg p-2 text-[#16425B]"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div>
                <label className="block text-[#16425B] font-medium mb-1">Correo electrónico</label>
                <input
                  className="w-full border border-[#3A7CA5] rounded-lg p-2 text-[#16425B]"
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="telefono">
            {(field) => (
              <div>
                <label className="block text-[#16425B] font-medium mb-1">Teléfono</label>
                <input
                  className="w-full border border-[#3A7CA5] rounded-lg p-2 text-[#16425B]"
                  type="tel"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="fechaNacimiento">
            {(field) => (
                <div>
                <label className="block text-[#16425B] font-medium mb-1">Fecha de nacimiento</label>
                <input
                    className="w-full border border-[#3A7CA5] rounded-lg p-2 text-[#16425B]"
                    type="date"
                    value={field.state.value.toISOString().split('T')[0]} // para mostrar en input
                    onChange={(e) => field.handleChange(new Date(e.target.value))}
                />
                </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div>
                <label className="block text-[#16425B] font-medium mb-1">Contraseña</label>
                <input
                  className="w-full border border-[#3A7CA5] rounded-lg p-2 text-[#16425B]"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => (
              <div>
                <label className="block text-[#16425B] font-medium mb-1">Confirmar contraseña</label>
                <input
                  className="w-full border border-[#3A7CA5] rounded-lg p-2 text-[#16425B]"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                className="w-full bg-[#3A7CA5] text-white py-2 rounded-lg font-semibold hover:bg-[#2F6690] transition"
                disabled={!canSubmit}
              >
                {isSubmitting ? 'Registrando...' : 'Registrarse'}
              </button>
            )}
          </form.Subscribe>
        </form>

        <div className="text-center text-sm text-[#16425B] mt-6">
          ¿Ya tenés una cuenta?{' '}
          <button className="text-[#2F6690] underline hover:text-[#16425B]">
            Iniciá sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPrueba