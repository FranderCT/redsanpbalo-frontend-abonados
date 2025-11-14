
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useUpdateProduct } from "../../Hooks/ProductsHooks";
import { useGetAllCategory } from "../../../Category/Hooks/CategoryHooks";
import { useGetAllUnitsMeasure } from "../../../UnitMeasure/Hooks/UnitMeasureHooks";
import { useGetAllMaterials } from "../../../Materials/Hooks/MaterialHooks";
import { useGetAllSupplier } from "../../../Supplier/Hooks/SupplierHooks";
import type { Product } from "../../Models/CreateProduct";
import { useState, useEffect } from "react";
import { SupplierSelectionModal } from "./SupplierSelectionModal";

type Props = {
  product: Product;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function UpdateProductModal({ product, open, onClose, onSuccess }: Props) {
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const updateProductMutation = useUpdateProduct();

  const { category: categories = [], isLoading: categoriesLoading } = useGetAllCategory();
  const { unit: units = [], isLoading: unitsLoading } = useGetAllUnitsMeasure();
  const { materials = [], isPending: materialsLoading, error: materialsError } = useGetAllMaterials();
  const { supplier: suppliers = [], isLoading: suppliersLoading } = useGetAllSupplier();
  
  // Cargar proveedores actuales del producto cuando se abre el modal
  useEffect(() => {
    if (open && product.ProductSuppliers) {
      const supplierIds = product.ProductSuppliers.map(ps => ps.Supplier.Id);
      setSelectedSuppliers(supplierIds);
    }
  }, [open, product.ProductSuppliers]);
  
  const handleClose = () =>{
    toast.warning("Edición cancelado",{position:"top-right",autoClose:3000});
    onClose();
  }

  const form = useForm({
    defaultValues: {
      Name: product.Name ?? "",
      Type: product.Type ?? "",
      Observation: product.Observation ?? "",
      CategoryId: product.Category?.Id ?? 0,
      MaterialId: product.Material?.Id ?? 0,
      UnitMeasureId: product.UnitMeasure?.Id ?? 0,
      IsActive: product.IsActive ?? true,
    },
    onSubmit: async ({ value, formApi }) => {
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
        IsActive: value.IsActive
      };

      try {
        await updateProductMutation.mutateAsync({ id: product.Id, data: payload });
        toast.success("¡Producto actualizado!", { position: "top-right", autoClose: 3000 });
        formApi.reset();
        onClose();
        onSuccess?.();
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ??
          err?.message ??
          "No se pudo actualizar el producto.";
        toast.error(msg, { position: "top-right", autoClose: 3000 });
      }
    },
  });
  
  const LABEL = "grid gap-1";
    const INPUT = "w-full px-4 py-2 bg-gray-50 border";

  return (
    <ModalBase
      open={open}
      onClose={handleClose}
      panelClassName="w-[min(90vw,700px)] p-4 flex flex-col max-h-[90vh]"
    >
      {/* Header */}
      <div className="flex-shrink-0 flex flex-col">
        <h2 className="text-2xl text-[#091540] font-bold">Editar producto</h2>
        <p className="text-md">Complete la información para editar un producto</p>
      </div>
      
      <div className="border-b border-[#222]/10"></div>

        {/* Formulario de edición */}
        <form
          id="update-product-form"
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
                <span className="text-sm text-gray-700">Nombre</span>
                <input
                  className={INPUT}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Nombre del producto"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
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
                <span className="text-sm text-gray-700">Tipo</span>
                <input
                  className={INPUT}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tipo de producto"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
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
                <span className="text-sm text-gray-700">Observación</span>
                <textarea
                  className={INPUT}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Observaciones del producto"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>

          {/* CategoryId (dropdown) */}
          <form.Field name="CategoryId">
            {(field) => (
              <label className={LABEL}>
                <span className="text-sm text-gray-700">Categoría</span>
                <select
                  className={INPUT}
                  value={field.state.value ?? 0}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  disabled={categoriesLoading}
                >
                  <option value={0} disabled>
                    {categoriesLoading ? "Cargando categorías..." : "Seleccione una categoría"}
                  </option>
                  {categories.map((c) => (
                    <option key={c.Id} value={c.Id}>
                      {c.Name}
                    </option>
                  ))}
                </select>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>

          {/* MaterialId (dropdown) */}
          <form.Field name="MaterialId">
            {(field) => (
              <label className={LABEL}>
                <span className="text-sm text-gray-700">Material</span>
                <select
                  className={INPUT}
                  value={field.state.value ?? 0}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  disabled={materialsLoading || !!materialsError}
                >
                  <option value={0} disabled>
                    {materialsLoading ? "Cargando materiales..." : "Seleccione un material"}
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
            )}
          </form.Field>

          {/* UnitMeasureId (dropdown para seleccionar unidad de medida) */}
          <form.Field name="UnitMeasureId">
            {(field) => (
              <label className={LABEL}>
                <span className="text-sm text-gray-700">Unidad de medida</span>
                <select
                  className={INPUT}
                  value={field.state.value ?? 0}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  disabled={unitsLoading}
                >
                  <option value={0} disabled>
                    {unitsLoading ? "Cargando unidades..." : "Seleccione una unidad"}
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

          {/* Estado */}
          <form.Field name="IsActive">
            {(field) => (
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <span className="text-sm text-gray-700">
                  {field.state.value ? "Activo" : "Inactivo"}
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={!!field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5"></div>
                </div>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
              </label>
            )}
          </form.Field>
        </form>
        {/* Footer botones */}
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <div className="mt-2 flex justify-end items-center gap-2">
              <button
                form="update-product-form"
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
              >
                {isSubmitting ? "Guardando…" : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="h-10 px-4 bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          )}
        </form.Subscribe>
      
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
      </ModalBase>
    );
}
