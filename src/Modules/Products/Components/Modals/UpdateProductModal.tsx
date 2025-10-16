
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useUpdateProduct } from "../../Hooks/ProductsHooks"; // 👈 igual a useUpdateUser pero para productos
import { useGetAllCategory } from "../../../Category/Hooks/CategoryHooks";
import { useGetAllUnitsMeasure } from "../../../UnitMeasure/Hooks/UnitMeasureHooks";
import { useGetAllMaterials } from "../../../Materials/Hooks/MaterialHooks";
import type { Product } from "../../Models/CreateProduct";
import { useGetAllLegalSuppliers } from "../../../LegalSupplier/Hooks/LegalSupplierHooks";
import { useGetAllPhysicalSuppliers } from "../../../PhysicalSupplier/Hooks/PhysicalSupplierHooks";
import { useEffect, useState } from "react";
import type { SupplierType } from "./CreateProductModal";

type Props = {
  product: Product;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function UpdateProductModal({ product, open, onClose, onSuccess }: Props) {
  const [supplierType, setSupplierType] = useState<SupplierType>("legal");
  const updateProductMutation = useUpdateProduct();

  const { category: categories = [], isLoading: categoriesLoading } = useGetAllCategory();
  const { unit: units = [], isLoading: unitsLoading } = useGetAllUnitsMeasure();
  const {
    materials = [],
    isPending: materialsLoading,
    error: materialsError,
  } = useGetAllMaterials();
  const {
    legalSup: legalSuppliers = [],
    isPending: legalLoading,
    error: legalError,
  } = useGetAllLegalSuppliers();

  const {
    phySup: physicalSuppliers = [],
    isPending: physicalLoading,
    error: physicalError,
  } = useGetAllPhysicalSuppliers();
  
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
      LegalSupplierId: product.LegalSupplier?.Id ?? 0, 
      PhysicalSupplierId: product.PhysicalSupplier?.Id ?? 0,
      IsActive: product.IsActive ?? true,
    },
    onSubmit: async ({ value, formApi }) => {
      const hasLegal = Number(value.LegalSupplierId) > 0;
      const hasPhysical = Number(value.PhysicalSupplierId) > 0;

      if (!hasLegal && !hasPhysical) {
        toast.error("Selecciona un proveedor (Jurídico o Físico).");
        return;
      }
      if (hasLegal && hasPhysical) {
        toast.error("Solo puedes seleccionar un tipo de proveedor.");
        return;
      }

      // Construimos el payload SIN enviar el campo que no aplica (evita @Min(1) con 0)
      const base = {
        Name: value.Name,
        Type: value.Type,
        Observation: value.Observation,
        CategoryId: Number(value.CategoryId),
        MaterialId: Number(value.MaterialId),
        UnitMeasureId: Number(value.UnitMeasureId),
        IsActive: value.IsActive
      };

      const payload = hasLegal
        ? { ...base, LegalSupplierId: Number(value.LegalSupplierId) }
        : { ...base, PhysicalSupplierId: Number(value.PhysicalSupplierId) };

      try {
        await updateProductMutation.mutateAsync({ id: product.Id, data: payload as any });
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

  // Al cambiar el tipo de proveedor, limpiamos el otro ID
    useEffect(() => {
      if (supplierType === "legal") {
        form.setFieldValue("PhysicalSupplierId", 0);
      } else {
        form.setFieldValue("LegalSupplierId", 0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supplierType]);
  
    const LABEL = "grid gap-1";
    const INPUT = "w-full px-4 py-2 bg-gray-50 border";
    const ERROR = "text-sm text-red-500 mt-1";

  return (
    <ModalBase
      open={open}
      onClose={handleClose}
      panelClassName="w-full max-w-xl !p-0 overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <h3 className="text-xl font-bold text-[#091540]">Editar producto</h3>
      </div>
      <div className="p-6 bg-white">
        {/* Formulario de edición */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="grid gap-4"
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
              </label>
            )}
          </form.Field>
          
          {/* ======== Supplier Type (RADIOS) ======== */}
            <div className="grid gap-2">
              <span className="text-sm text-[#091540] font-semibold">Tipo de Proveedor</span>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="supplierType"
                    value="legal"
                    checked={supplierType === "legal"}
                    onChange={() => setSupplierType("legal")}
                  />
                  <span>Jurídico</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="supplierType"
                    value="physical"
                    checked={supplierType === "physical"}
                    onChange={() => setSupplierType("physical")}
                  />
                  <span>Físico</span>
                </label>
              </div>
            </div>

            {/* ======== LegalSupplierId ======== */}
            {supplierType === "legal" && (
              <form.Field name="LegalSupplierId">
                {(field) => (
                  <label className={LABEL}>
                    <select
                      className={INPUT}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      disabled={legalLoading || !!legalError}
                    >
                      <option value={0} disabled>
                        {legalLoading ? "Cargando proveedores jurídicos..." : "Seleccione Proveedor Jurídico"}
                      </option>
                      {legalSuppliers.map((s: any) => (
                        <option key={s.Id} value={s.Id}>
                          {s.CompanyName ?? s.Name ?? `Proveedor #${s.Id}`}
                        </option>
                      ))}
                    </select>
                    {legalError && (
                      <span className="text-xs text-red-600 mt-1">
                        No se pudieron cargar los proveedores jurídicos.
                      </span>
                    )}
                  </label>
                )}
              </form.Field>
            )}

            {/* ======== PhysicalSupplierId ======== */}
            {supplierType === "physical" && (
              <form.Field name="PhysicalSupplierId">
                {(field) => (
                  <label className={LABEL}>
                    <select
                      className={INPUT}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      disabled={physicalLoading || !!physicalError}
                    >
                      <option value={0} disabled>
                        {physicalLoading ? "Cargando proveedores físicos..." : "Seleccione Proveedor Físico"}
                      </option>
                      {physicalSuppliers.map((s: any) => (
                        <option key={s.Id} value={s.Id}>
                          {s.Name}
                        </option>
                      ))}
                    </select>
                    {physicalError && (
                      <span className="text-xs text-red-600 mt-1">
                        No se pudieron cargar los proveedores físicos.
                      </span>
                    )}
                  </label>
                )}
              </form.Field>
            )}


          {/* IsActive */}
          <form.Field name="IsActive">
            {(field) => (
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <span className="text-sm text-gray-700">Activo</span>

                {/* Toggle */}
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

          {/* Footer botones */}
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <div className="mt-2 flex justify-end items-center gap-2">
                <button
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
        </form>
      </div>
    </ModalBase>
  );
}
