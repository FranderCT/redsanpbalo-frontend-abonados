import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { useUpdateMaterial } from "../Hooks/MaterialHooks";
import { ModalBase } from "../../../Components/Modals/ModalBase";
import type { Material } from "../Models/Material";
import { MaterialSchema } from "../schemas/Materials/MaterialSchema";

// Tipo de vista extendido para el modal (sin tocar tu modelo)
export type RowMaterial = Material & {
  Id: number;
  IsActive?: boolean;
};

type Props = {
  material: RowMaterial;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function EditMaterialModal({ material, open, onClose, onSuccess }: Props) {
  const updateMutation = useUpdateMaterial();

  const handleClose = () => {
    toast.info("Edición cancelada", { position: "top-right", autoClose: 3000 });
    onClose();
  };
  const form = useForm({
    validators:{
      onChange: MaterialSchema,
    },
    defaultValues: {
      Name: material.Name ?? "",
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateMutation.mutateAsync({ id: material.Id, data: { Name: value.Name.trim() } });
        toast.success("¡Material actualizado!", { position: "top-right", autoClose: 3000 });
        formApi.reset();
        onClose();
        onSuccess?.();
      } catch (err) {
        console.error(err);
        toast.error("No se pudo actualizar el material", { position: "top-right", autoClose: 3000 });
      }
    },
  });

  return (
    <ModalBase open={open} onClose={handleClose} panelClassName="w-full max-w-xl !p-0 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-5 text-[#091540]">
        <h3 className="text-xl font-bold">Editar material</h3>
        <p className="text-sm/6 opacity-90">Actualice los datos del material</p>
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
                    // autoFocus
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

          {/* Footer */}
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <div className="mt-4 flex flex-col md:flex-row md:justify-end gap-2">
                <button type="button" onClick={handleClose} className="h-10 px-4 bg-gray-200 hover:bg-gray-300 ">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60 "
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </div>
    </ModalBase>
  );
}
