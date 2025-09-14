import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useCreateUser } from "../../../Auth/Hooks/AuthHooks";
import { AdminUserInitialState } from "../../../Auth/Models/RegisterUser";
import { useGetAllRoles } from "../../Hooks/UsersHooks";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { AddUserSchema } from "../../schemas/AddUserSchema";

export default function RegisterAbonadosModal() {
  const [open, setOpen] = useState(false);
  const createUserMutation = useCreateUser();
  const { roles } = useGetAllRoles();
  // const [isAbonado, setIsAbonado] = useState<boolean>(AdminUserInitialState.IsAbonado);


  const form = useForm({
    defaultValues: AdminUserInitialState,
    validators:{
      onChange: AddUserSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createUserMutation.mutateAsync(value);
        toast.success("¡Registro exitoso!", { position: "top-right", autoClose: 3000 });
        setOpen(false);

        form.reset();
      } catch (error: any) {
        console.log("error", error);
        toast.error("¡Registro denegado!", { position: "top-right", autoClose: 3000 });
        form.reset();
      }
    },
  });

  return (
    <div >
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2  bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
      >
        + Agregar Usuario
      </button>

      <ModalBase
        open={open}
        onClose={() => setOpen(false)}
        panelClassName="w-full max-w-xl !p-0 overflow-hidden l shadow-2xl"
      >
        {/* Header */}
        <div className=" px-6 py-5 text-[#091540]]">
          <h3 className="text-xl font-bold">Crear cuenta</h3>
          <p className="text-sm/6 opacity-90">Complete los datos para registrarse</p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Contenedor con un panel lateral decorativo en md+ */}
          <div className="grid md:grid-cols-[1fr,1.3fr] gap-6">
            

            {/* Formulario */}
            <div className="min-w-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="grid gap-3"
              >
                {/* Cédula */}
                <form.Field name="IDcard">
                  {(field) => (
                    <>
                    <label className="grid gap-1">
                      <input
                        className="w-full px-4 py-2 bg-gray-50 border "
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
                    </label>
                    </>
                  )}
                </form.Field>

                {/* Nombre */}
                <form.Field name="Name">
                  {(field) => (
                    <>
                    <label className="grid gap-1">
                      <input
                        className="w-full px-4 py-2 bg-gray-100 text-[#091540] border "
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
                    </label>
                    </>
                  )}
                </form.Field>

                {/* Apellidos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <form.Field name="Surname1">
                    {(field) => (
                      <>
                      <label className="grid gap-1">
                        <input
                          className="w-full px-4 py-2 bg-gray-100 text-[#091540] border "
                          placeholder="Primer Apellido"
                          value={field.state.value}
                          disabled
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </label>
                      </>
                    )}
                  </form.Field>

                  <form.Field name="Surname2">
                    {(field) => (
                      <>
                      <label className="grid gap-1">
                        
                        <input
                          className="w-full px-4 py-2 bg-gray-100 text-[#091540] border "
                          placeholder="Segundo Apellido"
                          value={field.state.value}
                          disabled
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </label>
                      </>
                    )}
                  </form.Field>
                </div>

               {/* Soy abonado + NIS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Checkbox controlado por useState (y sincronizado con el form) */}
                  {/* <label className="group flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAbonado}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsAbonado(checked);                    // estado local para re-render inmediato
                        form.setFieldValue("IsAbonado", checked); // opcional: mantiene el valor en el form
                        if (!checked) form.setFieldValue("Nis", ""); // limpia NIS al desmarcar
                      }}
                      className="hidden peer"
                    />
                    <span className="relative w-4 h-4 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md transition-all duration-300 peer-checked:border-blue-500 peer-checked:bg-blue-500" />
                    <span className="ml-3 text-gray-700 group-hover:text-blue-500 font-medium transition-colors duration-300">
                      Soy abonado
                    </span>
                  </label> */}

                  <form.Field name="Nis">
                    {(field) => (
                      <>
                      <label className="grid gap-1">
                        <input
                          className={`w-full px-4 py-2 border`}
                          placeholder="NIS"
                          value={field.state.value}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ""))}
                          // disabled={!isAbonado}
                          // aria-disabled={!isAbonado}
                          // required={isAbonado}
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </label>
                      </>
                    )}
                  </form.Field>
                </div>


                {/* Email */}
                <form.Field name="Email">
                  {(field) => (
                    <>
                    <label className="grid gap-1">
                      
                      <input
                        className="w-full px-4 py-2 bg-gray-50 border "
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
                    </label>
                    </>
                  )}
                </form.Field>

                {/* Teléfono */}
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

                {/* Fecha de nacimiento */}
                <form.Field name="Birthdate">
                  {(field) => (
                    <>
                    <label className="grid gap-1">
                      <span className="text-sm text-gray-700">Fecha de Nacimiento</span>
                      <input
                        type="date"
                        value={
                          field.state.value
                            ? field.state.value instanceof Date
                              ? field.state.value.toISOString().split("T")[0]
                              : String(field.state.value)
                            : ""
                        }
                        onChange={(e) => {
                          field.handleChange(new Date(e.target.value));
                        }}
                        className="w-full px-4 py-2 bg-gray-50 border "
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500 mt-1">
                          {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                        </p>
                      )}
                    </label>
                    </>
                  )}
                </form.Field>

                {/* Dirección */}
                <form.Field name="Address">
                  {(field) => (
                    <>
                    <label className="grid gap-1">
                      
                      <input
                        className="w-full px-4 py-2 bg-gray-50 border "
                        placeholder="Dirección"
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500 mt-1">
                          {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                        </p>
                      )}
                    </label>
                    </>
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

                {/* Footer botones */}
                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                  {([canSubmit, isSubmitting]) => (
                    <div className="mt-4 flex flex-col md:flex-row md:justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="h-10 px-4  bg-gray-200 hover:bg-gray-300"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="h-10 px-5  bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                        disabled={!canSubmit}
                      >
                        {isSubmitting ? "Registrando…" : "Registrar"}
                      </button>
                    </div>
                  )}
                </form.Subscribe>   
              </form>
            </div>
          </div>
        </div>
      </ModalBase>
    </div>
  );
}
