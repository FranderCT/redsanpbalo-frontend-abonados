// Components/GetInfoProductModal.tsx
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useGetProductById } from "../../Hooks/ProductsHooks";
import type { Product } from "../../Models/CreateProduct";

type Props = {
  product: Product; // solo usamos product.Id
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const Field = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="bg-gray-50 p-3">
    <dt className="text-[11px] uppercase text-gray-500">{label}</dt>
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

  const close = () => { onClose(); onSuccess?.(); };

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
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <Field label="Proveedor" value={product?.Supplier?.Name} />
            <div className="sm:col-span-2">
              <Field label="Observación" value={product?.Observation} />
            </div>
          </dl>
        )}

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={close} className="h-10 px-4 bg-gray-200 hover:bg-gray-300">
            Cerrar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
