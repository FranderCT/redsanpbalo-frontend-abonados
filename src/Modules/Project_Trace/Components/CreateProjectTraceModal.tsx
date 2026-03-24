import { useState } from "react";
import { toast } from "sonner";
import { Plus, Package2, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/Components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { ProductSelectionModal } from "../../Project/components/NewProject/ProductSelectionModal";
import { getApiErrorMessages } from "@/core/api-error";
import { useGetAllProducts } from "../../Products/Hooks/ProductsHooks";
import type { Product } from "../../Products/Models/CreateProduct";
import type { newProjectTrace } from "../Models/ProjectTrace";
import { useCreateProjectTrace } from "../Hooks/ProjectTraceHooks";
import { useForm } from "@tanstack/react-form";
import { useCreateActualExpense } from "../../Actual-Expense/Hooks/ActualExpenseHooks";
import { useCreateProductDetail } from "../../Product-Detail/Hooks/ProductDetailHooks";
import type { NewActualExpense } from "../../Actual-Expense/Models/ActualExpense";
import type { NewProductDetail } from "../../Product-Detail/Models/ProductDetail";
import { ProjectTraceSchema } from "../schemas/ProjectTraceSchema";

type Props = { ProjectId: number };
type EntityWithOptionalId = { Id?: number; id?: number };

function getEntityId(value: EntityWithOptionalId | null | undefined): number | undefined {
  return value?.Id ?? value?.id;
}

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
    toast.warning("Seguimiento cancelado", { position: "top-right", duration: 3000 });
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
    validators: {
      onChange: ProjectTraceSchema,
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
        const traceId = getEntityId(traceRes);
        
        if (!traceId) {
          throw new Error("No se pudo obtener el ID del seguimiento creado");
        }
        
        // 2. Crear gasto real (dummy, puedes ajustar los datos)
        const actualExpensePayload: NewActualExpense = {
          TraceProjectId: traceId,
          Observation: "Gasto automático"
        };
        const actualExpenseRes = await actualExpenseMutation.mutateAsync(actualExpensePayload);
        const actualExpenseId = getEntityId(actualExpenseRes);
        
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
        toast.success(`Seguimiento creado con ${selectedProducts.length} producto(s) asignado(s)`, { position: "top-right", duration: 3000 });
        form.reset();
        setSelectedProducts([]);
        setOpen(false);
      } catch (err) {
        console.error("Error en el proceso de creación:", err);
        const messages = getApiErrorMessages(err);
        toast.error("Error al crear el seguimiento o productos", {
          position: "top-right",
          duration: 3000,
          description: messages.join(" | "),
        });
      }
    },
  });

  return (
    <>
      <Button onClick={() => setOpen(true)} className="shrink-0">
        <Plus className="mr-2 size-4" />
        Crear seguimiento de proyecto
      </Button>

      <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : handleClose())}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Nuevo seguimiento</DialogTitle>
            <DialogDescription>
              Registre un nuevo seguimiento para el proyecto y asigne productos.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="grid gap-6"
            >
              <FieldGroup>
                <form.Field name="Name">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="trace-name">Nombre del seguimiento</FieldLabel>
                        <Input
                          id="trace-name"
                          placeholder="Ej. Reparación de fuga en tramo 2"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          required
                        />
                        {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="Observation">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="trace-observation">Observación</FieldLabel>
                        <Textarea
                          id="trace-observation"
                          placeholder="Describa brevemente la observación o avance…"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="min-h-[120px]"
                        />
                        {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              <Card>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">Productos para el seguimiento</CardTitle>
                    <CardDescription>
                      Agregue los materiales utilizados y ajuste sus cantidades.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowProductModal(true)}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="mr-2 size-4" />
                    Agregar producto
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedProducts.length === 0 ? (
                    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 text-center">
                      <Package2 className="mb-3 size-8 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="font-medium">No hay productos agregados</p>
                        <p className="text-sm text-muted-foreground">
                          Haz clic en "Agregar producto" para comenzar.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead className="hidden md:table-cell">Tipo</TableHead>
                            <TableHead className="hidden md:table-cell">Categoría</TableHead>
                            <TableHead className="w-[130px] text-center">Cantidad</TableHead>
                            <TableHead className="w-[80px] text-right">Acción</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProducts.map(({ product, qty }) => (
                            <TableRow key={product.Id}>
                              <TableCell>
                                <div className="space-y-1">
                                  <p className="font-medium">{product.Name}</p>
                                  {product.Observation && (
                                    <p className="text-sm text-muted-foreground">{product.Observation}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground">
                                {product.Type || "—"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge variant="outline">
                                  {product.Category?.Name || "—"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min={1}
                                  className="text-center"
                                  value={qty}
                                  onChange={(e) => handleQtyChange(product.Id, Number(e.target.value) || 1)}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveProduct(product.Id)}
                                  title="Quitar producto"
                                >
                                  <Trash2 className="size-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {selectedProducts.length > 0 && (
                    <div className="flex flex-wrap justify-end gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">
                        Productos: {selectedProducts.length}
                      </Badge>
                      <Badge variant="secondary">
                        Cantidad total: {selectedProducts.reduce((sum, p) => sum + p.qty, 0)}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
                {([canSubmit, isSubmitting]) => {
                  const hasProducts = selectedProducts.length > 0;
                  const canSubmitForm = canSubmit && hasProducts && !isSubmitting;

                  return (
                    <DialogFooter className="w-full justify-between sm:justify-between sm:space-x-0">
                      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                          type="submit"
                          disabled={!canSubmitForm}
                          title={!hasProducts ? "Agregue al menos un producto" : ""}
                          className="w-full sm:w-auto"
                        >
                          {isSubmitting ? "Registrando..." : "Registrar seguimiento"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleClose}
                          className="w-full sm:w-auto"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </DialogFooter>
                  );
                }}
              </form.Subscribe>
            </form>
          </div>

          <ProductSelectionModal
            open={showProductModal}
            onClose={() => setShowProductModal(false)}
            products={products}
            onSelectProduct={handleSelectProduct}
            isLoading={productsLoading}
            selectedProductIds={selectedProducts.map(p => p.product.Id)}
          />

          <Dialog open={showQuantityModal} onOpenChange={(nextOpen) => (nextOpen ? setShowQuantityModal(true) : handleCancelAddProduct())}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle>Especificar cantidad</DialogTitle>
                <DialogDescription>
                  Indique cuántas unidades desea agregar al seguimiento.
                </DialogDescription>
              </DialogHeader>

              {selectedProductForQuantity ? (
                <>
                  <div className="space-y-4 px-6 pb-6">
                    <Card>
                      <CardContent className="space-y-2 pt-6">
                        <div>
                          <p className="font-medium">{selectedProductForQuantity.Name}</p>
                          {selectedProductForQuantity.Observation && (
                            <p className="text-sm text-muted-foreground">
                              {selectedProductForQuantity.Observation}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedProductForQuantity.Type && (
                            <Badge variant="outline">Tipo: {selectedProductForQuantity.Type}</Badge>
                          )}
                          {selectedProductForQuantity.Category && (
                            <Badge variant="outline">
                              Categoría: {selectedProductForQuantity.Category.Name}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid gap-2">
                      <FieldLabel htmlFor="trace-product-qty">Cantidad a agregar</FieldLabel>
                      <Input
                        id="trace-product-qty"
                        type="number"
                        min={1}
                        value={tempQuantity}
                        onChange={(e) => setTempQuantity(Number(e.target.value) || 1)}
                        onFocus={(e) => e.target.select()}
                        autoFocus
                      />
                    </div>
                  </div>

                  <DialogFooter className="w-full justify-between px-6 pb-6 sm:justify-between sm:space-x-0">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <Button
                        type="button"
                        onClick={handleConfirmAddProduct}
                        disabled={!tempQuantity || tempQuantity <= 0}
                        className="w-full sm:w-auto"
                      >
                        Agregar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelAddProduct}
                        className="w-full sm:w-auto"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </DialogFooter>
                </>
              ) : null}
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateProjectTraceModal;
