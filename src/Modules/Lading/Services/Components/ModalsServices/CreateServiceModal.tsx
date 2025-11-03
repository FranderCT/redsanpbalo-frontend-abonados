import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../../Components/Modals/ModalBase";
import { useCreateService } from "../../Hooks/ServicesHooks";

const CreateServiceModal = () => {
  const [open, setOpen] = useState(false);
  const createServiceMutation = useCreateService();

  const handleClose = () => {
    toast.warning("Registro cancelado", { position: "top-right", autoClose: 3000 });
    setOpen(false);
  };

  const form = useForm({
    defaultValues: {
      Icon: "",
      Title: "",
      Description: "",
    },
    onSubmit: async ({ value, formApi }) => {
      if (!value.Icon.trim() || !value.Title.trim() || !value.Description.trim()) {
        toast.error("Todos los campos son obligatorios", { 
          position: "top-right", 
          autoClose: 3000 
        });
        return;
      }

      try {
        await createServiceMutation.mutateAsync(value);
        toast.success("¡Servicio creado exitosamente!", { position: "top-right", autoClose: 3000 });
        formApi.reset();
        setOpen(false);
      } catch (err) {
        console.error("Error creando servicio:", err);
        toast.error("Error al crear el servicio", { position: "top-right", autoClose: 3000 });
      }
    },
  });

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex px-5 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
      >
        + Añadir Servicio
      </button>

      <ModalBase
        open={open}
        onClose={handleClose}
        panelClassName="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-4 text-[#091540]">
          <h3 className="text-xl font-semibold">Crear Servicio</h3>
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
          className="px-7 py-4 flex flex-col gap-4"
        >
          {/* Icono (URL) */}
          <form.Field name="Icon">
            {(field) => (
              <label className="grid gap-1">
                <span className="text-sm text-gray-700">URL del Icono</span>
                <input
                  autoFocus
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="https://ejemplo.com/icono.svg"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          </form.Field>

          {/* Título */}
          <form.Field name="Title">
            {(field) => (
              <label className="grid gap-1">
                <span className="text-sm text-gray-700">Título del Servicio</span>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Escriba el título"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          </form.Field>

          {/* Descripción */}
          <form.Field name="Description">
            {(field) => (
              <label className="grid gap-1">
                <span className="text-sm text-gray-700">Descripción</span>
                <textarea
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200 min-h-[120px]"
                  placeholder="Escriba la descripción del servicio"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
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
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Registrando…" : "Registrar"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-10 px-4 bg-gray-200 hover:bg-gray-300 transition"
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

export default CreateServiceModal;
