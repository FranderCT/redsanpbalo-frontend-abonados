import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useCreateProduct } from "../../Hooks/ProductsHooks";
import { useGetAllCategory } from "../../../Category/Hooks/CategoryHooks";
import { useGetAllUnitsMeasure } from "../../../UnitMeasure/Hooks/UnitMeasureHooks";
import { useGetAllMaterials } from "../../../Materials/Hooks/MaterialHooks";
import { useGetAllLegalSuppliers } from "../../../LegalSupplier/Hooks/LegalSupplierHooks";
import { useGetAllPhysicalSuppliers } from "../../../PhysicalSupplier/Hooks/PhysicalSupplierHooks";

type SupplierType = "legal" | "physical";

export default function CreateProductModal() {
  const [open, setOpen] = useState(false);
  const [supplierType, setSupplierType] = useState<SupplierType>("legal");

  const createProductMutation = useCreateProduct();

  // Cat/Units/Materials
  const { category: categories = [], isLoading: categoriesLoading } = useGetAllCategory();
  const { unit: units = [], isLoading: unitsLoading } = useGetAllUnitsMeasure();
  const { materials = [], isPending: materialsLoading, error: materialsError } = useGetAllMaterials();

  // Suppliers (tus hooks)
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

  const handleClose = () => {
    toast.warning("Registro cancelado", { position: "top-right", autoClose: 3000 });
    setOpen(false);
  };

  const form = useForm({
    defaultValues: {
      Name: "",
      Type: "",
      Observation: "",
      CategoryId: 0,
      MaterialId: 0,
      UnitMeasureId: 0,
      LegalSupplierId: 0,
      PhysicalSupplierId: 0,
    },
    onSubmit: async ({ value }) => {
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
      };

      const payload = hasLegal
        ? { ...base, LegalSupplierId: Number(value.LegalSupplierId) }
        : { ...base, PhysicalSupplierId: Number(value.PhysicalSupplierId) };

      try {
        await createProductMutation.mutateAsync(payload as any);
        toast.success("¡Producto creado!");
        form.reset();
        setOpen(false);
      } catch {
        toast.error("Error al crear el producto");
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

            {/* Footer (deshabilitar submit hasta que haya proveedor válido) */}
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="mt-4 flex justify-end gap-2">
                  <button
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
          </form>
        </div>
      </ModalBase>
    </>
  );
}
