// Components/GetInfoProductModal.tsx
import { useState } from "react";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useGetProductById } from "../../Hooks/ProductsHooks";
import type { Product } from "../../Models/CreateProduct";
import { Building2, User, Mail, Phone, MapPin } from "lucide-react";

type Props = {
  product: Product; // solo usamos product.Id
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const Field = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="bg-gray-50 p-3 rounded">
    <dt className="text-[11px] uppercase text-gray-500 font-medium">{label}</dt>
    <dd className="mt-1 text-sm text-[#091540] break-words">{value ?? "—"}</dd>
  </div>
);

export default function GetInfoProductModal({
  product: selected,
  open,
  onClose,
  onSuccess,
}: Props) {
  const { product, isLoading, error } = useGetProductById(selected.Id);
  const [showSuppliersModal, setShowSuppliersModal] = useState(false);

  const close = () => { onClose(); onSuccess?.(); };
  
  // Calcular cantidad de proveedores
  const suppliersCount = product?.ProductSuppliers?.length || 0;

  return (
    <ModalBase open={open} onClose={close} panelClassName="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl">
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <h3 className="text-xl font-bold text-[#091540]">Información del producto</h3>
        <span>Detalles del producto seleccionado</span>
      </div>

      <div className="p-6 bg-white">
        {isLoading && <p className="text-sm text-gray-600">Cargando…</p>}
        {error && !isLoading && <p className="text-sm text-red-600">No se pudo cargar.</p>}

        {!isLoading && !error && (
          <>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <Field label="ID Interno" value={product?.Id} />
              <Field
                label="Estado"
                value={
                  <span className={product?.IsActive ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {product?.IsActive ? "Activo" : "Inactivo"}
                  </span>
                }
              />
              <Field label="Nombre" value={product?.Name} />
              <Field label="Tipo" value={product?.Type} />
              <Field label="Unidad de medida" value={product?.UnitMeasure?.Name} />
              <Field label="Categoría" value={product?.Category?.Name} />
              <Field label="Material" value={product?.Material?.Name} />
              <div className="sm:col-span-2">
                <Field label="Observación" value={product?.Observation} />
              </div>
            </dl>

            {/* Sección de Proveedores */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setShowSuppliersModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#091540] group-hover:text-blue-600 transition-colors" />
                  <span className="text-sm font-medium text-[#091540] group-hover:text-blue-600 transition-colors">
                    Ver Proveedores
                    {suppliersCount > 0 && (
                      <span className="ml-2 text-xs font-normal text-gray-500">
                        ({suppliersCount} proveedor{suppliersCount > 1 ? 'es' : ''})
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-blue-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Click para ver →
                </span>
              </button>
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={close} className="h-10 px-4 bg-gray-200 hover:bg-gray-300">
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal de Proveedores */}
      <ModalBase 
        open={showSuppliersModal} 
        onClose={() => setShowSuppliersModal(false)}
        panelClassName="w-full max-w-3xl !p-0 overflow-hidden shadow-2xl"
      >
        <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#091540]">Proveedores del Producto</h3>
              <p className="text-sm text-gray-600">{product?.Name}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white max-h-[70vh] overflow-y-auto">
          {product?.ProductSuppliers && product.ProductSuppliers.length > 0 ? (
            <div className="flex flex-col gap-4">
              {product.ProductSuppliers.map((ps) => (
                <div key={ps.Id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-lg ${
                      ps.Supplier.Type === "PHYSICAL" 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-purple-100 text-purple-600"
                    }`}>
                      {ps.Supplier.Type === "PHYSICAL" ? (
                        <User className="w-6 h-6" />
                      ) : (
                        <Building2 className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-[#091540] truncate">{ps.Supplier.Name}</h5>
                        <span className={`text-[10px] px-2 py-1 rounded-full whitespace-nowrap font-medium ${
                          ps.Supplier.Type === "PHYSICAL" 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-purple-100 text-purple-700"
                        }`}>
                          {ps.Supplier.Type === "PHYSICAL" ? "Físico" : "Jurídico"}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        {ps.Supplier.Email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{ps.Supplier.Email}</span>
                          </div>
                        )}
                        {ps.Supplier.PhoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>{ps.Supplier.PhoneNumber}</span>
                          </div>
                        )}
                        {ps.Supplier.Location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{ps.Supplier.Location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Formato legacy */
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-700">Sin proveedor asignado</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button 
              type="button" 
              onClick={() => setShowSuppliersModal(false)} 
              className="h-10 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </ModalBase>
    </ModalBase>
  );
}
