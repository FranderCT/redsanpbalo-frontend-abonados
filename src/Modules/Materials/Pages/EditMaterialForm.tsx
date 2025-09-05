// Components/EditMaterialForm.tsx
import { useForm } from "@tanstack/react-form";
import type { Material } from "../Models/Material";
import { useUpdateMaterial } from "../Hooks/MaterialHooks";
import { toast } from "react-toastify";

type Props = {
  material: Material;        // material que editamos
  onSuccess?: () => void;    // cerrar modal al guardar
};

const EditMaterialForm = ({ material, onSuccess }: Props) => {
  const updateMaterialMutation = useUpdateMaterial();

const form = useForm({
  defaultValues: {
    Name: material.Name,
    Description: material.Description,
    IsActive: material.IsActive ?? true,
  },
  onSubmit: async ({ value, formApi }) => {
    try {
      await updateMaterialMutation.mutateAsync({
        id: material.Id,
        data: value,
      });

      toast.success("¡Material actualizado!", {
        position: "top-right",
        autoClose: 3000,
      });

      formApi.reset();   // opcional (vuelve a defaultValues)
      onSuccess?.();     // cerrar modal
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo actualizar el material.";
      toast.error(msg, {
        position: "top-right",
        autoClose: 4000,
      });
      console.error("Error al actualizar el material:", err);
    }
  },
});

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-[#091540] mb-4 text-center">
        Editar Material
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <form.Field name="Name">
          {(field) => (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1789FC]"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="Description">
          {(field) => (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1789FC]"
              />
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full py-2 rounded font-semibold bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-50 transition"
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};

export default EditMaterialForm;
