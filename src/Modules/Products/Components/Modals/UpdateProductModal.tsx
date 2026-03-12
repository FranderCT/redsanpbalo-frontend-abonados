import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { useGetAllCategory } from "../../../Category/Hooks/CategoryHooks";
import { useGetAllMaterials } from "../../../Materials/Hooks/MaterialHooks";
import { useGetAllSupplier } from "../../../Supplier/Hooks/SupplierHooks";
import { useGetAllUnitsMeasure } from "../../../UnitMeasure/Hooks/UnitMeasureHooks";
import { useUpdateProduct } from "../../Hooks/ProductsHooks";
import type { Product } from "../../Models/CreateProduct";
import { UpdateProductSchema } from "../../schemas/ProductSchema";
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
  const { materials = [], isPending: materialsLoading } = useGetAllMaterials();
  const { supplier: suppliers = [], isLoading: suppliersLoading } = useGetAllSupplier();

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
    validators: {
      onChange: UpdateProductSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      if (selectedSuppliers.length === 0) {
        toast.error("Debes seleccionar al menos un proveedor");
        return;
      }

      try {
        await updateProductMutation.mutateAsync({
          id: product.Id,
          data: {
            Name: value.Name.trim(),
            Type: value.Type.trim(),
            Observation: value.Observation?.trim() || "",
            CategoryId: Number(value.CategoryId),
            MaterialId: Number(value.MaterialId),
            UnitMeasureId: Number(value.UnitMeasureId),
            SuppliersIds: selectedSuppliers,
            IsActive: value.IsActive,
          },
        });

        toast.success("Producto actualizado correctamente");
        formApi.reset(value);
        onClose();
        onSuccess?.();
      } catch (err) {
        console.error("Error al actualizar producto:", err);
        toast.error("No se pudo actualizar el producto");
      }
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      Name: product.Name ?? "",
      Type: product.Type ?? "",
      Observation: product.Observation ?? "",
      CategoryId: product.Category?.Id ?? 0,
      MaterialId: product.Material?.Id ?? 0,
      UnitMeasureId: product.UnitMeasure?.Id ?? 0,
      IsActive: product.IsActive ?? true,
    });
    setSelectedSuppliers(product.ProductSuppliers?.map((item) => item.Supplier.Id) ?? []);
  }, [form, open, product]);

  const selectedSupplierLabels = selectedSuppliers
    .map((supplierId) => suppliers.find((supplierItem) => supplierItem.Id === supplierId))
    .filter((item): item is (typeof suppliers)[number] => Boolean(item));

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      setShowSupplierModal(false);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-[#091540]">Editar producto</DialogTitle>
            <DialogDescription>
              Actualiza la información base, el estado y los proveedores asociados.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2 px-6">
            <Badge variant="outline">ID #{product.Id}</Badge>
            <Badge variant={product.IsActive ? "default" : "destructive"}>
              {product.IsActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4 px-6 pb-6"
          >
            <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <form.Field
                    name="Name"
                    children={(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            autoComplete="off"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Ej. tuberia PVC…"
                          />
                          {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                        </Field>
                      );
                    }}
                  />

                  <form.Field
                    name="Type"
                    children={(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Tipo</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            autoComplete="off"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Ej. accesorio…"
                          />
                          {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                        </Field>
                      );
                    }}
                  />
                </div>

                <form.Field
                  name="Observation"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Observación</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          autoComplete="off"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Notas internas del producto…"
                        />
                        {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>

              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-3">
                  <form.Field
                    name="CategoryId"
                    children={(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Categoría</FieldLabel>
                          <Select
                            value={String(field.state.value)}
                            onValueChange={(value) => field.handleChange(Number(value))}
                          >
                            <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                              <SelectValue placeholder={categoriesLoading ? "Cargando…" : "Selecciona"} />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((item) => (
                                <SelectItem key={item.Id} value={String(item.Id)}>
                                  {item.Name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                        </Field>
                      );
                    }}
                  />

                  <form.Field
                    name="MaterialId"
                    children={(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Material</FieldLabel>
                          <Select
                            value={String(field.state.value)}
                            onValueChange={(value) => field.handleChange(Number(value))}
                          >
                            <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                              <SelectValue placeholder={materialsLoading ? "Cargando…" : "Selecciona"} />
                            </SelectTrigger>
                            <SelectContent>
                              {materials.map((item) => (
                                <SelectItem key={item.Id} value={String(item.Id)}>
                                  {item.Name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                        </Field>
                      );
                    }}
                  />

                  <form.Field
                    name="UnitMeasureId"
                    children={(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Unidad de medida</FieldLabel>
                          <Select
                            value={String(field.state.value)}
                            onValueChange={(value) => field.handleChange(Number(value))}
                          >
                            <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                              <SelectValue placeholder={unitsLoading ? "Cargando…" : "Selecciona"} />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((item) => (
                                <SelectItem key={item.Id} value={String(item.Id)}>
                                  {item.Name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                        </Field>
                      );
                    }}
                  />
                </div>
              </FieldGroup>

              <FieldGroup>
                <form.Field
                  name="IsActive"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Estado</FieldLabel>
                      <label className="flex items-center gap-3 rounded-md border border-input px-3 py-2">
                        <input
                          id={field.name}
                          name={field.name}
                          type="checkbox"
                          checked={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.checked)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm text-foreground">
                          {field.state.value ? "Producto activo" : "Producto inactivo"}
                        </span>
                      </label>
                    </Field>
                  )}
                />
              </FieldGroup>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Proveedores</p>
                    <p className="text-sm text-slate-500">
                      Mantén actualizada la relación de proveedores que abastecen este producto.
                    </p>
                  </div>
                  <Button type="button" variant="outline" onClick={() => setShowSupplierModal(true)}>
                    Seleccionar proveedores
                  </Button>
                </div>

                <div className="flex min-h-14 flex-wrap gap-2">
                  {selectedSupplierLabels.length > 0 ? selectedSupplierLabels.map((item) => (
                    <Badge key={item.Id} variant="secondary" className="gap-2">
                      <span className="max-w-[180px] truncate">{item.Name}</span>
                      <button
                        type="button"
                        className="text-xs"
                        onClick={() => setSelectedSuppliers((prev) => prev.filter((supplierId) => supplierId !== item.Id))}
                      >
                        ×
                      </button>
                    </Badge>
                  )) : (
                    <p className="text-sm text-amber-700">Este producto no tiene proveedores seleccionados.</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="w-full justify-between sm:justify-between sm:space-x-0">
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={!canSubmit || isSubmitting || selectedSuppliers.length === 0}
                    >
                      {isSubmitting ? "Guardando…" : "Guardar cambios"}
                    </Button>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" className="w-full sm:w-auto">
                        Cancelar
                      </Button>
                    </DialogClose>
                  </div>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <SupplierSelectionModal
        open={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        suppliers={suppliers}
        selectedSupplierIds={selectedSuppliers}
        onToggleSupplier={(supplierId) => {
          setSelectedSuppliers((prev) =>
            prev.includes(supplierId)
              ? prev.filter((currentId) => currentId !== supplierId)
              : [...prev, supplierId]
          );
        }}
        isLoading={suppliersLoading}
      />
    </>
  );
}
