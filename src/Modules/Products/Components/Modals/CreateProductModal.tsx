import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";

import { useCreateProduct } from "../../Hooks/ProductsHooks";
import { useGetAllCategory } from "../../../Category/Hooks/CategoryHooks";
import { useGetAllUnitsMeasure } from "../../../UnitMeasure/Hooks/UnitMeasureHooks";

import { newProductInitialState } from "../../Models/CreateProduct";
import { useGetAllMaterials } from "../../../Materials/Hooks/MaterialHooks";
import { ProductSchema } from "../../schemas/ProductSchema";

export default function CreateProductModal() {
  const [open, setOpen] = useState(false);
  const createProductMutation = useCreateProduct();

  const { category: categories = [], isLoading: categoriesLoading } = useGetAllCategory();
  const { unit: units = [], isLoading: unitsLoading } = useGetAllUnitsMeasure();

  // 👇 Hook de materiales
  const {
    materials = [],
    isPending: materialsLoading,
    error: materialsError,
  } = useGetAllMaterials();

  const form = useForm({
    defaultValues: newProductInitialState,
    validators: {
      onChange: ProductSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createProductMutation.mutateAsync(value);
        toast.success("¡Producto creado!");
        form.reset();
        setOpen(false);
      } catch {
        toast.error("Error al crear el producto");
      }
    },
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
      >
        + Añadir Producto
      </button>

      <ModalBase
        open={open}
        onClose={() => setOpen(false)}
        panelClassName="w-full max-w-xl !p-0 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-5 text-[#091540]">
          <h3 className="text-xl font-bold">Crear Producto</h3>
          <p className="text-sm opacity-90">Complete los campos requeridos</p>
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
            {/* Name */}
            <form.Field name="Name">
              {(field) => (
                <>
                <label className="grid gap-1">
                  <input
                    className="w-full px-4 py-2 bg-gray-50 border"
                    placeholder="Nombre del producto"
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

            {/* Type */}
            <form.Field name="Type">
              {(field) => (
                <>
                <label className="grid gap-1">
                  <input
                    className="w-full px-4 py-2 bg-gray-50 border"
                    placeholder="Tipo de producto"
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

            {/* Observation */}
            <form.Field name="Observation">
              {(field) => (
                <>
                <label className="grid gap-1">
                  <textarea
                    className="w-full px-4 py-2 bg-gray-50 border min-h-24"
                    placeholder="Observación"
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

            {/* CategoryId */}
            <form.Field name="CategoryId">
              {(field) => (
                <>
                <label className="grid gap-1">
                  <select
                    className="w-full px-4 py-2 bg-gray-50 border"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  >
                    <option value={0} disabled>
                      {categoriesLoading ? "Cargando..." : "Seleccione Categoría"}
                    </option>
                    {categories.map((c) => (
                      <option key={c.Id} value={c.Id}>
                        {c.Name}
                      </option>
                    ))}
                  </select>
                </label>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                      </p>
                  )}
                </>
              )}
            </form.Field>

            {/* UnitMeasureId */}
            <form.Field name="UnitMeasureId">
              {(field) => (
                <>
                <label className="grid gap-1">
                  <select
                    className="w-full px-4 py-2 bg-gray-50 border"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  >
                    <option value={0} disabled>
                      {unitsLoading ? "Cargando..." : "Seleccione Unidad"}
                    </option>
                    {units.map((u) => (
                      <option key={u.Id} value={u.Id}>
                        {u.Name}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                      </p>
                    )}
                </label>
                </>
              )}
            </form.Field>

            {/* MaterialId (AHORA dropdown) */}
            <form.Field name="MaterialId">
              {(field) => (
                <>
                <label className="grid gap-1">
                  <select
                    className="w-full px-3 py-2 bg-gray-50 border"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    disabled={materialsLoading || !!materialsError}
                  >
                    <option value={0} disabled>
                      {materialsLoading ? "Cargando materiales..." : "Seleccione Material"}
                    </option>
                    {materials.map((m) => (
                      <option key={m.Id} value={m.Id}>
                        {m.Name}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                      </p>
                    )}
                  {materialsError && (
                    <span className="text-xs text-red-600 mt-1">
                      No se pudieron cargar los materiales.
                    </span>
                  )}
                </label>
                </>
              )}
            </form.Field>

            {/* Footer botones */}
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="h-10 px-4 bg-gray-200 hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? "Guardando…" : "Guardar"}
                  </button>
                </div>
              )}
            </form.Subscribe>
          </form>
        </div>
      </ModalBase>
    </>
  );
}
