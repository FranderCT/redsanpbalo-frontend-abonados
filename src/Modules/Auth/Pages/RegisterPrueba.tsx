import { useForm } from "@tanstack/react-form";
import { useCreateUser } from "../Hooks/AuthHooks";
import { UserInitialState } from "../Models/User";

const RegisterPrueba = () => {
  const createUserMutation = useCreateUser();

  const form = useForm({
    defaultValues: UserInitialState,
    onSubmit: async ({ value }) => {
      await createUserMutation.mutateAsync(value);
      console.log("Usuario creado:", value);
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#D9DCD6] px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-[#16425B] mb-2 text-center">Cuenta Nueva</h2>
        <div className="h-1 w-16 bg-[#2F6690] mx-auto mb-6 rounded"></div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          <form.Field name="nombre">
            {(field) => (
              <>
                <label className="block text-sm font-medium text-[#2F6690]">Nombre *</label>
                <input
                  className="w-full px-4 py-2 border border-[#2F6690] rounded-md text-sm text-[#16425B]"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>

          <form.Field name="apellidos">
            {(field) => (
              <>
                <label className="block text-sm font-medium text-[#2F6690]">Apellidos *</label>
                <input
                  className="w-full px-4 py-2 border border-[#2F6690] rounded-md text-sm text-[#16425B]"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>

          <form.Field name="cedula">
            {(field) => (
              <>
                <label className="block text-sm font-medium text-[#2F6690]">Cédula *</label>
                <input
                  className="w-full px-4 py-2 border border-[#2F6690] rounded-md text-sm text-[#16425B]"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>

          <form.Field name="nis">
            {(field) => (
              <>
                <label className="block text-sm font-medium text-[#2F6690]">NIS *</label>
                <input
                  className="w-full px-4 py-2 border border-[#2F6690] rounded-md text-sm text-[#16425B]"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <>
                <label className="block text-sm font-medium text-[#2F6690]">Correo *</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-[#2F6690] rounded-md text-sm text-[#16425B]"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>

          <form.Field name="telefono">
            {(field) => (
              <>
                <label className="block text-sm font-medium text-[#2F6690]">Teléfono *</label>
                <input
                  className="w-full px-4 py-2 border border-[#2F6690] rounded-md text-sm text-[#16425B]"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>

          <form.Field name="Password">
            {(field) => (
              <>
                <label className="block text-sm font-medium text-[#2F6690]">Contraseña *</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-[#2F6690] rounded-md text-sm text-[#16425B]"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => (
              <>
                <label className="block text-sm font-medium text-[#2F6690]">Confirmar Contraseña *</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-[#2F6690] rounded-md text-sm text-[#16425B]"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-3 text-white bg-[#3A7CA5] hover:bg-[#2F6690] transition rounded-md font-semibold"
              >
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </button>
            )}
          </form.Subscribe>
        </form>

        <p className="text-center mt-6 text-sm text-[#16425B]">
          ¿Ya tenés una cuenta?{" "}
          <a
            className="text-[#2F6690] hover:underline font-medium cursor-pointer"
          >
            Iniciá sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPrueba;
