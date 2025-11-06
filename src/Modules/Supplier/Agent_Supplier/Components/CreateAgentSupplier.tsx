import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useCreateAgentSupplier } from "../../Hooks/AgentSupplierHooks";
import { newAgentInitialState } from "../../Models/AgentSupplier";
import { useGetAllSupplier } from "../../Hooks/SupplierHooks";
import type { Supplier } from "../../Models/Supplier";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { AgentSupplierSchema } from "../schemas/AgentSupplierSchema";

const CreateAgentSupplierModal = () => {
  const [open, setOpen] = useState(false);
  const createAgentSupplierMutation = useCreateAgentSupplier();
  const  { supplier, isLoading } = useGetAllSupplier();
  const handleClose = () => {
      toast.warning("Registro cancelado", { position: "top-right", autoClose: 3000 });
      setOpen(false);
  };
  const form = useForm({
    defaultValues: newAgentInitialState,
     validators:{
       onChange: AgentSupplierSchema,
     },
    onSubmit: async ({ value, formApi }) => {
      try {
        await createAgentSupplierMutation.mutateAsync(value as any);
        toast.success("¡Registro exitoso!", { position: "top-right", autoClose: 3000 });
        formApi.reset(); // limpia los campos
        setOpen(false);
      } catch (err) {
        console.error("Error creando agente:", err);
        toast.error("¡Registro sin éxito!", { position: "top-right", autoClose: 3000 });
        formApi.reset();
      }
    },
  });

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex  px-5 py-2  bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
      >
        + Añadir Agente
      </button>

      <ModalBase
        open={open}
        onClose={handleClose}
        panelClassName="w-full max-w-md !p-0 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-4 text-[#091540]">
          <h3 className="text-xl font-semibold">Crear Agente</h3>
          <p className="text-sm opacity-80">Complete los datos para registrar</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="px-7 py-2 flex flex-col gap-3"
        >
          {/* Nombre */}
            <form.Field name="Name">
              {(field) => (
                <>
                <label className="grid gap-1">
                  <span className="text-sm text-gray-700">Nombre del Agente</span>
                  <input
                    autoFocus
                    className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Ingrese nombre del agente"
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
            <form.Field name="Surname1">
              {(field) => (
                <>
                <label className="grid gap-1">
                  <span className="text-sm text-gray-700">Primer apellido del Agente</span>
                  <input
                    autoFocus
                    className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Ingrese primer apellido del agente"
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
            <form.Field name="Surname2">
              {(field) => (
                <>
                <label className="grid gap-1">
                  <span className="text-sm text-gray-700">Segundo apellido del Agente</span>
                  <input
                    autoFocus
                    className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Ingrese segundo apellido del agente"
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
            <form.Field name="Email">
              {(field) => (
                <>
                <label className="grid gap-1">
                  <span className="text-sm text-gray-700">Correo electrónico del Agente</span>
                  <input
                    autoFocus
                    className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Ingrese correo electrónico del agente"
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
            <form.Field name="SupplierId">
            {(field) => (
              <label className="grid gap-1">
                <select
                  className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  disabled={isLoading}
                >
                  <option value={0} disabled>
                    {isLoading ? "Cargando proveedores..." : "Seleccione un proveedor"}
                  </option>
                  {supplier.map((s: Supplier) => (
                    <option key={s.Id} value={s.Id}>
                      {s.Name}
                    </option>
                  ))}
                </select>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>
          {/* Footer */}
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <div className="mt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  type="submit"
                  className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60 transition"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "Registrando…" : "Registrar"}
                </button>
                <button
                  type="button"
                  //onClose={handleClose}
                  onClick={handleClose}
                  className="h-10 px-4  bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </ModalBase>
    </div>
  );
};

export default CreateAgentSupplierModal;
