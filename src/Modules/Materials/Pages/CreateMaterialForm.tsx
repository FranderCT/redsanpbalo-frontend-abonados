import { useForm } from "@tanstack/react-form";
import { MaterialInitialState } from "../Models/Material";
import { useCreateMaterial } from "../Hooks/MaterialHooks";
import { toast } from "react-toastify";

type Props = {
  onSuccess?: () => void; // opcional: cerrar modal al terminar
};

const CreateMaterialForm = ({ onSuccess }: Props) => {
  const createMaterialMutation = useCreateMaterial();

const form = useForm({
  defaultValues: MaterialInitialState,
  onSubmit: async ({ value }) => {
    try {
      const { Name, Description, Unit } = value; 
      await createMaterialMutation.mutateAsync({ Name, Description, Unit });

      toast.success("¡Registro exitoso!", {
        position: "top-right",
        autoClose: 3000,
      });

      form.reset();
      onSuccess?.(); // cierra modal si se provee
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo crear el material.";
      toast.error(msg, {
        position: "top-right",
        autoClose: 4000,
      });
      console.error("Error al crear el material:", err);
    }
  },
});


  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-[#091540] mb-6 text-center">
        Registrar Material
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-5"
      >
        <form.Field name="Name">
          {(field) => (
            <div className="flex flex-col gap-1">

              <input
                type="text"
                placeholder="Ingrese nombre del material"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1789FC] focus:border-[#1789FC] disabled:bg-gray-100 disabled:text-gray-500"
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field name="Description">
          {(field) => (
            <div className="flex flex-col gap-1">
              
              <input
                type="text"
                placeholder="Ingrese la descripción del material"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1789FC] focus:border-[#1789FC] disabled:bg-gray-100 disabled:text-gray-500"
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field name="Unit">
          {(field) => (
            <div className="flex flex-col gap-1">
              
              <input
                type="text"
                placeholder="Ingrese la unidad del material"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1789FC] focus:border-[#1789FC] disabled:bg-gray-100 disabled:text-gray-500"
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              className="w-full bg-[#091540] shadow-md text-white py-2  font-semibold hover:bg-[#1789FC] transition disabled:opacity-50"
              disabled={!canSubmit}
            >
              {isSubmitting ? "..." : "Registrar"}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};

export default CreateMaterialForm;
