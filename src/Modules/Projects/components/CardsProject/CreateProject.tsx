// src/Modules/Projects/components/ModalsProject/CreateProjectModal.tsx
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useCreateProject } from "../../Hooks/ProjectHooks"; // <- ajusta ruta si difiere
import { newProjectInitialState } from "../../Models/Project";
// Si ya tienes un schema de Zod para proyectos, impórtalo: // <- crea/ajusta


const CreateProjectModal = () => {
  const [open, setOpen] = useState(false);
  const createProjectMutation = useCreateProject();

  const handleClose = () => {
    toast.warning("Registro cancelado", { position: "top-right", autoClose: 3000 });
    setOpen(false);
  };

  const form = useForm({
      defaultValues: newProjectInitialState,
      validators:{
        //onChange: MaterialSchema,
      },
      onSubmit: async ({ value, formApi }) => {
        try {
          await createProjectMutation.mutateAsync(value);
          toast.success("¡Registro exitoso!", { position: "top-right", autoClose: 3000 });
          formApi.reset(); // limpia los campos
          setOpen(false);
        } catch (err) {
          console.error("Error creando proyecto:", err);
          toast.error("¡Registro sin éxito!", { position: "top-right", autoClose: 3000 });
          formApi.reset();
        }
      },
    });

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex px-5 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
      >
        + Añadir Proyecto
      </button>

      <ModalBase
        open={open}
        onClose={handleClose}
        panelClassName="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-4 text-[#091540]">
          <h3 className="text-xl font-semibold">Crear Proyecto</h3>
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
          className="px-7 py-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Nombre */}
          <form.Field name="Name">
            {(field) => (
              <label className="grid gap-1">
                <span className="text-sm text-gray-700">Nombre del proyecto</span>
                <input
                  autoFocus
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Ej. Acueducto Santa Rita"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>

          {/* Ubicación */}
          <form.Field name="Location">
            {(field) => (
              <label className="grid gap-1">
                <span className="text-sm text-gray-700">Ubicación</span>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Ej. Puerto Santa Rita"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>

          {/* Fecha inicial */}
          <form.Field name="InnitialDate">
            {(field) => (
              <label className="grid gap-1">
                <span className="text-sm text-gray-700">Fecha de inicio</span>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                  value={field.state.value instanceof Date && !Number.isNaN(field.state.value.getTime())
                          ? field.state.value.toISOString().slice(0,10)
                          : typeof field.state.value === 'string' ? field.state.value : ''}
                  onChange={(e) => { field.handleChange(new Date(e.target.value)); }}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>

          {/* Fecha final */}
          <form.Field name="EndDate">
            {(field) => (
              <label className="grid gap-1">
                <span className="text-sm text-gray-700">Fecha de finalización</span>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                  value={field.state.value instanceof Date && !Number.isNaN(field.state.value.getTime())
                          ? field.state.value.toISOString().slice(0,10)
                          : typeof field.state.value === 'string' ? field.state.value : ''}
                  onChange={(e) => { field.handleChange(new Date(e.target.value)); }}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>

          {/* Espacio de documentos (Drive/SharePoint/etc.) */}
          <form.Field name="SpaceOfDocument">
            {(field) => (
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm text-gray-700">Espacio de documentos (URL)</span>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="https://drive.google.com/..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>

          {/* Objetivo */}
          <form.Field name="Objective">
            {(field) => (
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm text-gray-700">Objetivo</span>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Describe el objetivo del proyecto"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>

          {/* Descripción */}
          <form.Field name="Description">
            {(field) => (
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm text-gray-700">Descripción</span>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Resumen del proyecto"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>

          {/* Observaciones */}
          <form.Field name="Observation">
            {(field) => (
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm text-gray-700">Observaciones</span>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Notas u observaciones adicionales"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>

          {/* Footer */}
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <div className="mt-2 md:col-span-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-10 px-4 bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60 transition"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Registrando…" : "Registrar"}
                </button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </ModalBase>
    </div>
  );
};

export default CreateProjectModal;
