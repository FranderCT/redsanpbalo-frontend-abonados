import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useCreateCategory } from "../../Hooks/CategoryHooks";
import { NewCategoryInitialState } from "../../Models/Category";
import { CategorySchema } from "../../schemas/CategorySchema";

const CreateCategoryModal = () => {
  const [open, setOpen] = useState(false);
  const createCategoryMutation = useCreateCategory();
  const handleClose = () => {
      toast.warning("Registro cancelado", { position: "top-right", autoClose: 3000 });
      setOpen(false);
  };
  const form = useForm({
    defaultValues: NewCategoryInitialState,
    validators:{
      onChange: CategorySchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await createCategoryMutation.mutateAsync(value);
        toast.success("¡Registro exitoso!", { position: "top-right", autoClose: 3000 });
        formApi.reset(); // limpia los campos
        setOpen(false);
      } catch (err) {
        console.error("Error creando categoría:", err);
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
        + Agregar Categoría
      </button>

      <ModalBase
        open={open}
        onClose={handleClose}
        panelClassName="w-full max-w-md !p-0 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-4 text-[#091540]">
          <h3 className="text-xl font-semibold">Crear Categoría</h3>
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
                  <span className="text-sm text-gray-700">Nombre de la categoría</span>
                  <input
                    autoFocus
                    className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Nombre de la categoría"
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

          <form.Field name="Description">
            {(field) => (
              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Descripción de la categoría
                </span>
                <textarea
                  className="w-full min-h-[50px] px-4 py-2 bg-gray-50 border focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Escriba la descripción de la categoría"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={2} // altura inicial
                />
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

export default CreateCategoryModal;
