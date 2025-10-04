import { useState } from "react";
import { toast } from "react-toastify";
import { ModalBase } from "../../../Components/Modals/ModalBase";
import { ProductSelectionModal } from "../../Project/components/NewProject/ProductSelectionModal";
import { useGetAllProducts } from "../../Products/Hooks/ProductsHooks";
import type { Product } from "../../Products/Models/CreateProduct";
import type { newProjectTrace } from "../Models/ProjectTrace";
import { useCreateProjectTrace } from "../Hooks/ProjectTraceHooks";
import { useForm } from "@tanstack/react-form";
import { useCreateActualExpense } from "../../Actual-Expense/Hooks/ActualExpenseHooks";
import { useCreateProductDetail } from "../../Product-Detail/Hooks/ProductDetailHooks";
import type { NewActualExpense } from "../../Actual-Expense/Models/ActualExpense";
import type { NewProductDetail } from "../../Product-Detail/Models/ProductDetail";

type Props = { ProjectId: number };

// 🎨 Estilos centralizados
const PANEL = "w-full max-w-4xl !p-0 overflow-hidden shadow-2xl";
const WRAP = "bg-white";
const HEADER = "px-6 py-5 border-b border-gray-200";
const TITLE = "text-xl font-bold text-[#091540]";
const SUB = "text-sm text-gray-600";
const SECTION = "p-6";
const GRID = "grid gap-3";
const LABEL = "text-sm text-[#091540]";
const INPUT =
  "w-full px-4 py-2 bg-gray-50 border border-gray-200  outline-none " +
  "focus:ring-2 focus:ring-[#1789FC] focus:border-[#1789FC] placeholder-gray-400";
const TEXTAREA =
  "w-full min-h-[110px] px-4 py-2 resize-y bg-gray-50 border border-gray-200  outline-none " +
  "focus:ring-2 focus:ring-[#1789FC] focus:border-[#1789FC] placeholder-gray-400";
const FOOTER = "mt-4 flex justify-end gap-2";
const BTN_PRIMARY =
  "h-10 px-5  bg-[#091540] text-white hover:bg-[#1789FC] transition disabled:opacity-60";
const BTN_SECONDARY =
  "h-10 px-4 bg-gray-200 text-[#091540] hover:bg-gray-300 transition";
const TRIGGER_BTN =
  "px-4 py-2  bg-[#091540] text-white shadow hover:bg-[#1789FC] transition";

const CreateProjectTraceModal = ({ ProjectId }: Props) => {
  const [open, setOpen] = useState(false);

  // Hooks en orden
  const createTraceMutation = useCreateProjectTrace();
  const actualExpenseMutation = useCreateActualExpense();
  const productDetailMutation = useCreateProductDetail();

  // Productos
  const { products = [], isPending: productsLoading } = useGetAllProducts();
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ product: Product; qty: number }>>([]);

  // Agregar producto desde modal
  const handleSelectProduct = (product: Product) => {
    // Si ya está, no lo agrega de nuevo
    if (selectedProducts.some((p) => p.product.Id === product.Id)) return;
    setSelectedProducts((prev) => [...prev, { product, qty: 1 }]);
  };

  // Cambiar cantidad
  const handleQtyChange = (id: number, qty: number) => {
    setSelectedProducts((prev) => prev.map((p) => p.product.Id === id ? { ...p, qty } : p));
  };

  // Quitar producto
  const handleRemoveProduct = (id: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.product.Id !== id));
  };

  const handleClose = () => {
    toast.warning("Seguimiento cancelado", { position: "top-right", autoClose: 3000 });
    setOpen(false);
  };


  const form = useForm({
    defaultValues: {
      Name: "",
      Observation: "",
      ProjectId,
    },
    onSubmit: async ({ value }) => {
      const payload: newProjectTrace = {
        Name: value.Name.trim(),
        Observation: value.Observation.trim(),
        ProjectId,
      };

      try {
        // 1. Crear seguimiento
        const traceRes = await createTraceMutation.mutateAsync(payload);
        const traceId = (traceRes as any)?.Id ?? (traceRes as any)?.id;
        
        if (!traceId) {
          throw new Error("No se pudo obtener el ID del seguimiento creado");
        }
        
        // 2. Crear gasto real (dummy, puedes ajustar los datos)
        const actualExpensePayload: NewActualExpense = {
          TraceProjectId: traceId,
          Observation: "Gasto automático"
        };
        const actualExpenseRes = await actualExpenseMutation.mutateAsync(actualExpensePayload);
        const actualExpenseId = (actualExpenseRes as any)?.Id ?? (actualExpenseRes as any)?.id;
        
        if (!actualExpenseId) {
          throw new Error("No se pudo obtener el ID del gasto real creado");
        }
        
        // 3. Crear detalles de producto
        for (const { product, qty } of selectedProducts) {
          const productDetailPayload: NewProductDetail = {
            ProductId: product.Id,
            Quantity: qty,
            ActualExpenseId: actualExpenseId,
          };
          await productDetailMutation.mutateAsync(productDetailPayload);
        }
        toast.success("Seguimiento y productos registrados", { position: "top-right", autoClose: 3000 });
        form.reset();
        setSelectedProducts([]);
        setOpen(false);
      } catch (err) {
        console.error("Error en el proceso de creación:", err);
        toast.error("Error al crear el seguimiento o productos", { position: "top-right", autoClose: 3000 });
      }
    },
  });

  return (
    <>
      {/* Botón para abrir modal */}
      <button onClick={() => setOpen(true)} className={TRIGGER_BTN}>
        + Crear seguimiento de proyecto
      </button>

      <ModalBase open={open} onClose={handleClose} panelClassName={PANEL}>
        <div className={WRAP}>
          {/* Header */}
          <header className={HEADER}>
            <h2 className={TITLE}>Nuevo seguimiento</h2>
            <p className={SUB}>Registre un nuevo seguimiento para el proyecto y asigne productos</p>
          </header>
          {/* Body */}
          <section className={SECTION}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className={GRID}
            >
              {/* Nombre del seguimiento */}
              <form.Field name="Name">
                {(field) => (
                  <label className="grid gap-1">
                    <span className={LABEL}>Nombre del seguimiento</span>
                    <input
                      className={INPUT}
                      placeholder="Ej. Reparación de fuga en tramo 2"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                  </label>
                )}
              </form.Field>
              {/* Observación */}
              <form.Field name="Observation">
                {(field) => (
                  <label className="grid gap-1">
                    <span className={LABEL}>Observación</span>
                    <textarea
                      className={TEXTAREA}
                      placeholder="Describa brevemente la observación o avance…"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </label>
                )}
              </form.Field>

              {/* Productos asignados */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#091540]">Productos asignados</span>
                  <button type="button" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setShowProductModal(true)}>
                    + Agregar producto
                  </button>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  {selectedProducts.length === 0 && <div className="text-gray-400">No hay productos asignados.</div>}
                  {selectedProducts.map(({ product, qty }) => (
                    <div key={product.Id} className="flex items-center gap-3 py-1">
                      <span className="flex-1">{product.Name}</span>
                      <input
                        type="number"
                        min={1}
                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                        value={qty}
                        onChange={e => handleQtyChange(product.Id, Number(e.target.value))}
                      />
                      <button type="button" className="text-red-500 hover:underline" onClick={() => handleRemoveProduct(product.Id)}>
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer / Acciones */}
              <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <div className={FOOTER}>
                    <button
                      type="submit"
                      className={BTN_PRIMARY}
                      disabled={!canSubmit || isSubmitting}
                    >
                      {isSubmitting ? "Registrando…" : "Registrar"}
                    </button>
                    <button type="button" onClick={handleClose} className={BTN_SECONDARY}>
                      Cancelar
                    </button>
                  </div>
                )}
              </form.Subscribe>
            </form>
          </section>
        </div>
        {/* Modal de selección de productos */}
        <ProductSelectionModal
          open={showProductModal}
          onClose={() => setShowProductModal(false)}
          products={products}
          onSelectProduct={handleSelectProduct}
          isLoading={productsLoading}
          selectedProductIds={selectedProducts.map(p => p.product.Id)}
        />
      </ModalBase>
    </>
  );
};

export default CreateProjectTraceModal;
