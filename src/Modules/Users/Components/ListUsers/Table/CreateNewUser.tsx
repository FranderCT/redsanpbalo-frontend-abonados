 
import { toast } from "react-toastify";
import { useCreateAbonado } from "../../../../Auth/Hooks/AuthHooks";
import { useForm } from "@tanstack/react-form";
import { RegisterUserInitialState } from "../../../../Auth/Models/RegisterUser";
import { RegisterSchema } from "../../../../Auth/schemas/RegisterSchemas";

export default function CreateNewUser({ onSuccess }: { onSuccess?: () => void }) {
  const createAbonadoMutation = useCreateAbonado();

  const form = useForm({
    defaultValues: RegisterUserInitialState,
    validators: { onChange: RegisterSchema },
    onSubmit: async ({ value }) => {
      if (value.Password !== value.ConfirmPassword) {
        toast.error("Las contraseñas no coinciden");
        return;
      }
      try {
        const { IsAbonado, ...userData } = value;
        await createAbonadoMutation.mutateAsync(userData);
        toast.success("¡Registro exitoso!", { position: "top-right", autoClose: 3000 });
        form.reset();
        onSuccess?.();
      } catch (error:any) {
        console.error(error);
        toast.error("¡Registro denegado!", { position: "top-right", autoClose: 3000 });
        form.reset();
      }
    },
  });

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4">
      {/* Encabezado */}
      <div className="p-3 w-full">
        <h2 className="md:text-3xl font-bold text-[#091540] text-center">Crear un nuevo usuario</h2>
        <hr className="mt-2 border-t-2 border-dashed border-[#091540]" />
      </div>

      {/* Formulario */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="w-full p-2 flex flex-col gap-4"
      >
        {/* Cédula */}
        <form.Field name="IDcard">
        {(field) => (
            <>
            <input
                className="input-base"
                placeholder="Cédula"
                value={field.state.value}
                onChange={async (e) => {
                const cedula = e.target.value;
                field.handleChange(cedula);

                if (cedula.length >= 9) {
                    try {
                    const res = await fetch(`https://apis.gometa.org/cedulas/${cedula}`);
                    if (!res.ok) throw new Error("No se encontró este número de cédula");
                    const data = await res.json();

                    if (data?.nombre) {
                        const partes = data.nombre.trim().split(/\s+/);
                        const apellido2 = partes.pop() || "";
                        const apellido1 = partes.pop() || "";
                        const nombre = partes.join(" ");

                        form.setFieldValue("Name", nombre);
                        form.setFieldValue("Surname1", apellido1);
                        form.setFieldValue("Surname2", apellido2);
                    }
                    } catch (err) {
                    console.warn("Error buscando cédula:", err);
                    form.setFieldValue("Name", "");
                    form.setFieldValue("Surname1", "");
                    form.setFieldValue("Surname2", "");
                    }
                }
                }}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                </p>
            )}
            </>
        )}
        </form.Field>

        {/* Nombre */}
        <form.Field name="Name">
        {(field) => (
            <>
            <input
                className="input-base"
                placeholder="Nombre"
                value={field.state.value}
                disabled
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

        {/* Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
        <form.Field name="Surname1">
            {(field) => (
            <>
                <input
                className="input-base"
                placeholder="Apellido1"
                value={field.state.value}
                disabled
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

        <form.Field name="Surname2">
            {(field) => (
            <>
                <input
                className="input-base"
                placeholder="Apellido2"
                value={field.state.value}
                disabled
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
        </div>

        {/* Soy abonado + NIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
        <form.Field name="IsAbonado">
            {(field) => (
            <label className="group flex items-center cursor-pointer select-none">
                <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => {
                    const checked = e.target.checked;
                    field.handleChange(checked);
                    if (!checked) form.setFieldValue("Nis", "");
                }}
                className="hidden peer"
                />
                <span className="relative w-4 h-4 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md transition-all duration-300 peer-checked:border-blue-500 peer-checked:bg-blue-500" />
                <span className="ml-3 text-gray-700 group-hover:text-blue-500 font-medium transition-colors duration-300">
                Soy abonado
                </span>
            </label>
            )}
        </form.Field>

        <form.Field name="Nis">
            {(field) => {
            const isAbonado = form.getFieldValue("IsAbonado");
            const disabled = !isAbonado;
            return (
                <>
                <input
                    className={`input-base ${disabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : ""}`}
                    placeholder="NIS"
                    value={field.state.value}
                    inputMode="numeric"
                    pattern="\d*"
                    onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ""))}
                    disabled={disabled}
                    aria-disabled={disabled}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && isAbonado && (
                    <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                )}
                </>
            );
            }}
        </form.Field>
        </div>

        {/* Email */}
        <form.Field name="Email">
        {(field) => (
            <>
            <input
                className="input-base"
                placeholder="Correo electrónico"
                type="email"
                value={field.state.value}
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

        {/* Teléfono */}
        <form.Field name="PhoneNumber">
        {(field) => (
            <>
            <input
                className="input-base"
                placeholder="Número telefónico"
                value={field.state.value}
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

        {/* Fecha de nacimiento */}
        <form.Field name="Birthdate">
        {(field) => (
            <>
            <input
                type="date"
                className="input-base"
                value={
                field.state.value
                    ? (field.state.value instanceof Date
                        ? field.state.value.toISOString().split("T")[0]
                        : String(field.state.value))
                    : ""
                }
                onChange={(e) => {
                field.handleChange(new Date(e.target.value));
                }}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                </p>
            )}
            </>
        )}
        </form.Field>

        {/* Dirección */}
        <form.Field name="Address">
        {(field) => (
            <>
            <textarea
                className="input-base min-h-10 max-h-18 overflow-y-auto resize-y whitespace-pre-wrap"
                placeholder="Dirección"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={3}
                autoComplete="street-address"
                spellCheck
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                </p>
            )}
            </>
        )}
        </form.Field>

        {/* Contraseña */}
        <form.Field name="Password">
        {(field) => (
            <>
            <input
                className="input-base"
                placeholder="Contraseña"
                type="password"
                value={field.state.value}
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

        {/* Confirmar contraseña */}
        <form.Field name="ConfirmPassword">
        {(field) => (
            <>
            <input
                className="input-base"
                placeholder="Confirmar contraseña"
                type="password"
                value={field.state.value}
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


        {/* Botón */}
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              className="bg-[#091540] hover:bg-blue-600 text-white font-bold px-4 py-2 w-full disabled:opacity-50"
              disabled={!canSubmit}
            >
              {isSubmitting || createAbonadoMutation.isPending ? "..." : "Registrar"}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}


