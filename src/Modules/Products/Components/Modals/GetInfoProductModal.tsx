import { Badge } from "@/Components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useGetProductById } from "../../Hooks/ProductsHooks";
import type { Product, ProductSupplier } from "../../Models/CreateProduct";
import { getProductSuppliers } from "../../Models/CreateProduct";
import { Building2, Mail, MapPin, Package2, Phone, Shapes, UserRound } from "lucide-react";

type Props = {
  product: Product;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const Field = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
    <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</dt>
    <dd className="mt-1 break-words text-sm text-[#091540]">{value ?? "—"}</dd>
  </div>
);

function SupplierDetailCard({ productSupplier }: { productSupplier: ProductSupplier }) {
  const supplier = productSupplier.Supplier;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
          {supplier.Type === "PHYSICAL" ? <UserRound className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-[#091540]">{supplier.Name}</p>
            <Badge variant="outline">
              {supplier.Type === "PHYSICAL" ? "Proveedor físico" : "Proveedor jurídico"}
            </Badge>
          </div>

          <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="truncate">{supplier.Email || "Sin correo"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{supplier.PhoneNumber || "Sin teléfono"}</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{supplier.Location || "Sin ubicación"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GetInfoProductModal({ product: selected, open, onClose, onSuccess }: Props) {
  const { product, isLoading, error } = useGetProductById(selected.Id);

  const close = () => {
    onClose();
    onSuccess?.();
  };

  const suppliers = product ? getProductSuppliers(product) : [];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) close(); }}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-[#091540]">Información del producto</DialogTitle>
          <DialogDescription>
            Detalle completo del producto y sus proveedores asociados.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 px-6">
          <Badge variant="outline">ID #{selected.Id}</Badge>
          {product ? (
            <Badge variant={product.IsActive ? "default" : "destructive"}>
              {product.IsActive ? "Activo" : "Inactivo"}
            </Badge>
          ) : null}
          <Badge variant="secondary">
            {suppliers.length} {suppliers.length === 1 ? "proveedor" : "proveedores"}
          </Badge>
        </div>

        <div className="flex flex-col gap-6 px-6 pb-6">
          {isLoading ? <p className="text-sm text-gray-600">Cargando...</p> : null}
          {error && !isLoading ? <p className="text-sm text-red-600">No se pudo cargar el producto.</p> : null}

          {!isLoading && !error ? (
            <>
              <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                      <Package2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#091540]">{product?.Name}</h3>
                      <p className="text-sm text-slate-500">{product?.Type}</p>
                    </div>
                  </div>

                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Nombre" value={product?.Name} />
                    <Field label="Tipo" value={product?.Type} />
                    <Field label="Categoría" value={product?.Category?.Name} />
                    <Field label="Material" value={product?.Material?.Name} />
                    <Field label="Unidad de medida" value={product?.UnitMeasure?.Name} />
                    <Field label="Estado" value={product?.IsActive ? "Activo" : "Inactivo"} />
                    <div className="sm:col-span-2">
                      <Field label="Observación" value={product?.Observation || "Sin observaciones"} />
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                      <Shapes className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#091540]">Resumen</h3>
                      <p className="text-sm text-slate-500">Datos rápidos para validación.</p>
                    </div>
                  </div>

                  <dl className="grid gap-3">
                    <Field label="ID interno" value={product?.Id} />
                    <Field label="Cantidad de proveedores" value={suppliers.length} />
                    <Field label="Proveedor principal" value={suppliers[0]?.Name || "Sin proveedores"} />
                  </dl>
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#091540]">Proveedores asociados</h3>
                    <p className="text-sm text-slate-500">
                      Consulta rápidamente quién abastece este producto.
                    </p>
                  </div>
                </div>

                {product?.ProductSuppliers?.length ? (
                  <div className="grid gap-3 lg:grid-cols-2">
                    {product.ProductSuppliers.map((item) => (
                      <SupplierDetailCard key={item.Id} productSupplier={item} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                    Este producto no tiene proveedores asociados.
                  </div>
                )}
              </section>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
