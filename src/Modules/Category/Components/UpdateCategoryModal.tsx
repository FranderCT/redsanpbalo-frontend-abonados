import {  useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../Components/Modals/ModalBase";
import { useUpdateCategory } from "../Hooks/CategoryHooks";
import type { Category } from "../Models/Category";

type Props = {
    category : Category;
    open : boolean;
    onClose: () => void;
    onSuccess?: () =>void;
}

const UpdateCategoryModal = ({category, open, onClose, onSuccess}: Props) => {

  const updateCategoryModalMutation = useUpdateCategory();

  const form = useForm({
    defaultValues: {
      Name: category?.Name ?? "",
      Description: category?.Description ?? "",
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateCategoryModalMutation.mutateAsync({
          id: category.Id,
          data: value,
        });
        toast.success("¡Categoría actualizada!", { position: "top-right", autoClose: 3000 });
        formApi.reset();
        onClose?.();
        onSuccess?.();
      } catch (err) {
        console.error("error desconocido", err);
        toast.error("Error al actualizar la Categoría", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  return (
    <ModalBase
    open={open}
    onClose={onClose}
    panelClassName="w-full max-w-xl !p-0 overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <h3 className="text-xl font-bold text-[#091540]">Editar Categoría</h3>
      </div>

      {/* Body */}
      <div className="p-6 bg-white">
        {/* Información del usuario (labels + valores en bloques grandes) */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Información de la Categoría</h4>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className=" bg-gray-50 p-3">
              <dt className="text-[11px] uppercase tracking-wide text-gray-500">Nombre De la Categoría</dt>
              <dd className="mt-1 text-sm text-[#091540] break-words">
                {category.Name ?? "-"}
              </dd>
            </div>
          </dl>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className=" bg-gray-50 p-3">
              <dt className="text-[11px] uppercase tracking-wide text-gray-500">Descripcion De la Categoría</dt>
              <dd className="mt-1 text-sm text-[#091540] break-words">
                {category.Description ?? "-"}
              </dd>
            </div>
          </dl>
        </div>

         {/* Formulario de edición */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="grid gap-4"
        >

          <form.Field name="Name">
            {(field) => (
              <label className="grid gap-1">
                <span className="text-sm text-gray-700">Nuevo Nombre de Categoría</span>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-[#1789FC]"
                  value={field.state.value}
                  inputMode="tel"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Escriba el nuevo nombre de la categoría"
                />
              </label>
            )}
          </form.Field>

          <form.Field name="Description">
            {(field) => (
              <label className="grid gap-1">
                <span className="text-sm text-gray-700">Nuevo Descripción de Categoría</span>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-[#1789FC]"
                  value={field.state.value}
                  inputMode="tel"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Escriba la nueva descripción de la categoría"
                />
              </label>
            )}
          </form.Field>

           <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <div className="mt-2 flex justify-end items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-4 bg-gray-200 hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                >
                  {isSubmitting ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            )}
          </form.Subscribe>
        
        </form>
      </div>
      {/*Final del body*/}
    </ModalBase>
  )
}

export default UpdateCategoryModal