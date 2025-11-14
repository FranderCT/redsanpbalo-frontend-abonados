import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useCreateProduct } from "../../Hooks/ProductsHooks";
import { useGetAllCategory } from "../../../Category/Hooks/CategoryHooks";
import { useGetAllUnitsMeasure } from "../../../UnitMeasure/Hooks/UnitMeasureHooks";
import { useGetAllMaterials } from "../../../Materials/Hooks/MaterialHooks";
import { useGetAllSupplier } from "../../../Supplier/Hooks/SupplierHooks";
import { ProductSchema } from "../../schemas/ProductSchema";
import { SupplierSelectionModal } from "./SupplierSelectionModal";

export default function CreateProductModal() {
  const [open, setOpen] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const createProductMutation = useCreateProduct();

  // Cat/Units/Materials
  const { category: categories = [], isLoading: categoriesLoading } = useGetAllCategory();
  const { unit: units = [], isLoading: unitsLoading } = useGetAllUnitsMeasure();
  const { materials = [], isPending: materialsLoading, error: materialsError } = useGetAllMaterials();

  // Todos los proveedores (físicos y legales juntos)
  const { supplier: suppliers = [], isLoading: suppliersLoading} = useGetAllSupplier();

  const handleClose = () => {
    toast.warning("Registro cancelado", { position: "top-right", autoClose: 3000 });
    setOpen(false);
    setSelectedSuppliers([]);
  };

  const form = useForm({
    defaultValues: {
      Name: "",
      Type: "",
      Observation: "",
      CategoryId: 0,
      MaterialId: 0,
      UnitMeasureId: 0,
    },
    validators: {
       onChange: ProductSchema,
    },
    onSubmit: async ({ value }) => {
      if (selectedSuppliers.length === 0) {
        toast.error("Debes seleccionar al menos un proveedor");
        return;
      }

      const payload = {
        Name: value.Name,
        Type: value.Type,
        Observation: value.Observation,
        CategoryId: Number(value.CategoryId),
        MaterialId: Number(value.MaterialId),
        UnitMeasureId: Number(value.UnitMeasureId),
        SuppliersIds: selectedSuppliers.filter(id => id > 0),
      };

      try {
        await createProductMutation.mutateAsync(payload);
        toast.success("¡Producto creado!");
        form.reset();
        setSelectedSuppliers([]);
        setOpen(false);
      } catch {
        toast.error("Error al crear el producto");
      }
    },
  });

  const LABEL = "grid gap-1";
  const INPUT = "w-full px-4 py-2 bg-gray-50 border";
  const ERROR = "text-sm text-red-500 mt-1";

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
        onClose={handleClose}
        panelClassName="w-[min(90vw,700px)] p-4 flex flex-col max-h-[90vh]"
        >
        {/* Header */}
        <div className="flex-shrink-0 flex flex-col">
          <h3 className="text-2xl text-[#091540] font-bold">Crear Producto</h3>
          <p className="text-md">Complete los campos requeridos</p>
        </div>

        <div className="border-b border-[#222]/10"></div>

        {/* Body */}
          <form
            id="create-product-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex-1 min-h-0 px-2 py-2 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Name */}
            <form.Field name="Name">
              {(field) => (
                <label className={LABEL}>
                  <input
                    className={INPUT}
                    placeholder="Nombre del producto"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className={ERROR}>
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            {/* Type */}
            <form.Field name="Type">
              {(field) => (
                <label className={LABEL}>
                  <input
                    className={INPUT}
                    placeholder="Tipo de producto"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className={ERROR}>
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            {/* Observation */}
            <form.Field name="Observation">
              {(field) => (
                <label className={LABEL}>
                  <textarea
                    className="w-full px-4 py-2 bg-gray-50 border min-h-24"
                    placeholder="Observación"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className={ERROR}>
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            {/* CategoryId */}
            <form.Field name="CategoryId">
              {(field) => (
                <label className={LABEL}>
                  <select
                    className={INPUT}
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
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className={ERROR}>
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            {/* UnitMeasureId */}
            <form.Field name="UnitMeasureId">
              {(field) => (
                <label className={LABEL}>
                  <select
                    className={INPUT}
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
                    <p className={ERROR}>
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            {/* MaterialId */}
            <form.Field name="MaterialId">
              {(field) => (
                <label className={LABEL}>
                  <select
                    className={INPUT}
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
                    <p className={ERROR}>
                      {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                  )}
                  {materialsError && (
                    <span className="text-xs text-red-600 mt-1">No se pudieron cargar los materiales.</span>
                  )}
                </label>
              )}
            </form.Field>

            {/* ======== Proveedores (Modal desplegable) ======== */}
            <div className="grid gap-2">
              <span className="text-sm text-[#091540] font-semibold">
                Proveedores
              </span>
              
              <button
                type="button"
                onClick={() => setShowSupplierModal(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded text-left hover:border-blue-500 hover:bg-blue-50 transition flex justify-between items-center"
              >
                <span className="text-sm">
                  {selectedSuppliers.length === 0 ? (
                    <span className="text-gray-500">Seleccionar proveedores...</span>
                  ) : (
                    <span className="text-[#091540]">
                      {selectedSuppliers.length} proveedor{selectedSuppliers.length > 1 ? 'es' : ''} seleccionado{selectedSuppliers.length > 1 ? 's' : ''}
                    </span>
                  )}
                </span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {selectedSuppliers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSuppliers.map((supplierId) => {
                    const supplier = suppliers.find(s => s.Id === supplierId);
                    if (!supplier) return null;
                    return (
                      <span
                        key={supplierId}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {supplier.Name}
                        <button
                          type="button"
                          onClick={() => setSelectedSuppliers(selectedSuppliers.filter(id => id !== supplierId))}
                          className="hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
              
              {selectedSuppliers.length === 0 && (
                <p className="text-xs text-orange-600">Debes seleccionar al menos un proveedor</p>
              )}
            </div>
          </form>
          {/* Footer (deshabilitar submit hasta que haya proveedor válido) */}
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <div className="flex-shrink-0 mt-4 flex justify-end gap-2 border-t border-gray-200 pt-3">
                <button
                  form="create-product-form"
                  type="submit"
                  className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "Registrando…" : "Registrar"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-10 px-4 bg-gray-200 hover:bg-gray-300">
                  Cancelar
                </button>
              </div>
            )}
          </form.Subscribe>
      </ModalBase>

      {/* Modal de selección de proveedores */}
      <SupplierSelectionModal
        open={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        suppliers={suppliers}
        selectedSupplierIds={selectedSuppliers}
        onToggleSupplier={(supplierId) => {
          if (selectedSuppliers.includes(supplierId)) {
            setSelectedSuppliers(selectedSuppliers.filter(id => id !== supplierId));
          } else {
            setSelectedSuppliers([...selectedSuppliers, supplierId]);
          }
        }}
        isLoading={suppliersLoading}
      />
    </>
  );
}
