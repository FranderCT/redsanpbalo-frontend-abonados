import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { useCreateMaterial } from "../Hooks/MaterialHooks";
import { ModalBase } from "../../../Components/Modals/ModalBase";
import { MaterialSchema } from "../schemas/Materials/MaterialSchema";
import { newMaterialInitialState } from "../Models/Material";

type Props = {
  onCreated?: () => void;
};

export default function CreateMaterialForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const createMaterialMutation = useCreateMaterial();

  const handleClose = () => {
    setOpen(false);
    toast.info("Creación cancelada", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const form = useForm({
    defaultValues: newMaterialInitialState,
    validators: {
      onChange: MaterialSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const payload = { Name: value.Name.trim() };
        await createMaterialMutation.mutateAsync(payload);

        toast.success("¡Material creado!", { position: "top-right", autoClose: 3000 });
        formApi.reset();
        setOpen(false);
        onCreated?.();
      } catch (error: any) {
        console.error("Error creando material:", error);
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "No se pudo crear el material";
        toast.error(msg, { position: "top-right", autoClose: 3000 });
      }
    },
  });

  return (
    <div>
      {/* Botón que abre el modal */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
      >
        + Agregar Nuevo Material
      </button>

      {/* Modal */}
      <ModalBase
        open={open}
        onClose={handleClose}   // ⬅️ ahora usamos handleClose
        panelClassName="w-full max-w-xl !p-0 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-5 text-[#091540]">
          <h3 className="text-xl font-bold">Crear material</h3>
          <p className="text-sm/6 opacity-90">Complete los datos del material</p>
        </div>

        {/* Body */}
        <div className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="grid gap-3"
          >
            {/* Nombre */}
            <form.Field name="Name">
              {(field) => (
                <label className="grid gap-1">
                  <span className="text-sm text-gray-700">Nombre</span>
                  <input
                    autoFocus
                    className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Nombre del material"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors?.[0]?.message ? (
                    <span className="text-xs text-red-600">
                      {field.state.meta.errors[0].message}
                    </span>
                  ) : null}
                </label>
              )}
            </form.Field>

            {/* Footer botones */}
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="mt-4 flex flex-col md:flex-row md:justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleClose}  // ⬅️ también aquí
                    className="h-10 px-4 bg-gray-200 hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? "Creando…" : "Crear material"}
                  </button>
                </div>
              )}
            </form.Subscribe>
          </form>
        </div>
      </ModalBase>
    </div>
  );
}
