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
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedProductForQuantity, setSelectedProductForQuantity] = useState<Product | null>(null);
  const [tempQuantity, setTempQuantity] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ product: Product; qty: number }>>([]);

  // Cuando se selecciona un producto del modal, mostrar modal de cantidad
  const handleSelectProduct = (product: Product) => {
    setSelectedProductForQuantity(product);
    setTempQuantity(1);
    setShowProductModal(false);
    setShowQuantityModal(true);
  };

  // Confirmar agregar producto con cantidad
  const handleConfirmAddProduct = () => {
    if (!selectedProductForQuantity || tempQuantity <= 0) return;
    
    const existingIndex = selectedProducts.findIndex(p => p.product.Id === selectedProductForQuantity.Id);
    
    if (existingIndex >= 0) {
      // Si ya existe, sumar la cantidad
      setSelectedProducts(prev => prev.map((p, index) => 
        index === existingIndex 
          ? { ...p, qty: p.qty + tempQuantity }
          : p
      ));
    } else {
      // Si no existe, agregarlo
      setSelectedProducts(prev => [...prev, { product: selectedProductForQuantity, qty: tempQuantity }]);
    }
    
    setShowQuantityModal(false);
    setSelectedProductForQuantity(null);
    setTempQuantity(1);
  };

  // Cancelar agregar producto
  const handleCancelAddProduct = () => {
    setShowQuantityModal(false);
    setSelectedProductForQuantity(null);
    setTempQuantity(1);
  };

  // Cambiar cantidad directamente en la lista
  const handleQtyChange = (id: number, qty: number) => {
    if (qty <= 0) return;
    setSelectedProducts((prev) => prev.map((p) => p.product.Id === id ? { ...p, qty } : p));
  };

  // Quitar producto
  const handleRemoveProduct = (id: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.product.Id !== id));
  };

  const handleClose = () => {
    toast.warning("Seguimiento cancelado", { position: "top-right", autoClose: 3000 });
    form.reset();
    setSelectedProducts([]);
    setShowProductModal(false);
    setShowQuantityModal(false);
    setSelectedProductForQuantity(null);
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
        toast.success(`Seguimiento creado con ${selectedProducts.length} producto(s) asignado(s)`, { position: "top-right", autoClose: 3000 });
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
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-[#091540]">Productos para el seguimiento</span>
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-[#091540] text-white rounded hover:bg-[#1789FC] transition flex items-center gap-2"
                    onClick={() => setShowProductModal(true)}
                  >
                    <span>+</span> Agregar producto
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg bg-gray-50 min-h-[120px]">
                  {selectedProducts.length === 0 ? (
                    <div className="flex items-center justify-center h-[120px] text-gray-500">
                      <div className="text-center">
                        <p className="mb-2">No hay productos agregados</p>
                        <p className="text-sm">Haz clic en "Agregar producto" para comenzar</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 space-y-3">
                      {selectedProducts.map(({ product, qty }) => (
                        <div key={product.Id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-[#091540] mb-1">{product.Name}</h4>
                              {product.Observation && (
                                <p className="text-sm text-gray-600 mb-2">{product.Observation}</p>
                              )}
                              <div className="flex gap-4 text-xs text-gray-500">
                                {product.Type && <span>Tipo: {product.Type}</span>}
                                {product.Category && <span>Categoría: {product.Category.Name}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 ml-4">
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">Cantidad:</label>
                                <input
                                  type="number"
                                  min={1}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:border-[#1789FC] focus:outline-none"
                                  value={qty}
                                  onChange={e => handleQtyChange(product.Id, Number(e.target.value) || 1)}
                                />
                              </div>
                              <button 
                                type="button" 
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                                onClick={() => handleRemoveProduct(product.Id)}
                                title="Quitar producto"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {selectedProducts.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600 text-right">
                    Total de productos: {selectedProducts.length} | Total cantidad: {selectedProducts.reduce((sum, p) => sum + p.qty, 0)}
                  </div>
                )}
              </div>

              {/* Footer / Acciones */}
              <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
                {([canSubmit, isSubmitting]) => {
                  const hasProducts = selectedProducts.length > 0;
                  const canSubmitForm = canSubmit && hasProducts && !isSubmitting;
                  
                  return (
                    <div className={FOOTER}>
                      {!hasProducts && (
                        <p className="text-sm text-amber-600 flex-1">
                          ⚠️ Debe agregar al menos un producto para continuar
                        </p>
                      )}
                      <button
                        type="submit"
                        className={BTN_PRIMARY}
                        disabled={!canSubmitForm}
                        title={!hasProducts ? "Agregue al menos un producto" : ""}
                      >
                        {isSubmitting ? "Registrando…" : "Registrar seguimiento"}
                      </button>
                      <button type="button" onClick={handleClose} className={BTN_SECONDARY}>
                        Cancelar
                      </button>
                    </div>
                  );
                }}
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

        {/* Modal de cantidad */}
        <ModalBase 
          open={showQuantityModal} 
          onClose={handleCancelAddProduct}
          panelClassName="w-full max-w-md"
        >
          <div className="bg-white p-6">
            <h3 className="text-lg font-semibold text-[#091540] mb-4">
              Especificar cantidad
            </h3>
            
            {selectedProductForQuantity && (
              <div className="mb-4">
                <div className="bg-gray-50 p-3 rounded border mb-4">
                  <h4 className="font-medium text-[#091540] mb-1">
                    {selectedProductForQuantity.Name}
                  </h4>
                  {selectedProductForQuantity.Observation && (
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedProductForQuantity.Observation}
                    </p>
                  )}
                  <div className="flex gap-4 text-xs text-gray-500">
                    {selectedProductForQuantity.Type && (
                      <span>Tipo: {selectedProductForQuantity.Type}</span>
                    )}
                    {selectedProductForQuantity.Category && (
                      <span>Categoría: {selectedProductForQuantity.Category.Name}</span>
                    )}
                  </div>
                </div>
                
                <label className="block">
                  <span className="text-sm font-medium text-[#091540] mb-2 block">
                    Cantidad a agregar:
                  </span>
                  <input
                    type="number"
                    min={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#1789FC] focus:outline-none text-center"
                    value={tempQuantity}
                    onChange={(e) => setTempQuantity(Number(e.target.value) || 1)}
                    onFocus={(e) => e.target.select()}
                    autoFocus
                  />
                </label>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelAddProduct}
                className="px-4 py-2 bg-gray-200 text-[#091540] rounded hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAddProduct}
                className="px-4 py-2 bg-[#091540] text-white rounded hover:bg-[#1789FC] transition"
                disabled={!tempQuantity || tempQuantity <= 0}
              >
                Agregar
              </button>
            </div>
          </div>
        </ModalBase>
      </ModalBase>
    </>
  );
};

export default CreateProjectTraceModal;
