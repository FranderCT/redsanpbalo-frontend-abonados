// Components/GetInfoPhysicalSupplierModal.tsx
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import type { PhysicalSupplier } from "../../Models/PhysicalSupplier";

type Props = {
  supplier: PhysicalSupplier;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function GetInfoPhysicalSupplierModal({
  supplier,
  open,
  onClose,
  onSuccess,
}: Props) {
  const PANEL = "w-full max-w-2xl !p-0 overflow-hidden shadow-2xl";
  const WRAP = "bg-white";
  const HEADER = "px-6 py-5 border-b border-gray-200";
  const SECTION = "p-6";
  const GRID = "grid grid-cols-1 sm:grid-cols-2 gap-3";
  const CARD = "bg-gray-50 p-3";
  const LABEL = "text-[11px] uppercase text-gray-500";
  const VALUE = "mt-1 text-sm text-[#091540]";
  const FOOTER = "mt-6 flex justify-end";

  // ✅ Helper para mostrar “—”
  const show = (v?: string | number | null) =>
    v === null || v === undefined || v === "" ? "—" : String(v);

  const emailHref = supplier?.Email ? `mailto:${supplier.Email}` : undefined;
  const telHref = supplier?.PhoneNumber ? `tel:${supplier.PhoneNumber}` : undefined;

  return (
    <ModalBase
      open={open}
      onClose={() => {
        onClose();
        onSuccess?.();
      }}
      panelClassName={PANEL}
    >
      <div className={WRAP}>
        {/* Header */}
        <header className={HEADER}>
          <h3 className="text-xl font-bold text-[#091540]">Información del proveedor</h3>
          <p className="text-sm text-gray-600">Proveedor físico</p>
        </header>

        {/* Body */}
        <section className={SECTION} aria-labelledby="supplier-info-heading">
          <h4 id="supplier-info-heading" className="sr-only">Datos del proveedor</h4>

          <dl className={GRID}>
            <div className={CARD}>
              <dt className={LABEL}>ID interno</dt>
              <dd className={VALUE}>{show(supplier?.Id)}</dd>
            </div>

            <div className={CARD}>
              <dt className={LABEL}>Cédula</dt>
              <dd className={VALUE}>{show(supplier?.IDcard)}</dd>
            </div>

            <div className={CARD}>
              <dt className={LABEL}>Nombre</dt>
              <dd className={`${VALUE} break-words`}>{show(supplier?.Name)}</dd>
            </div>

            <div className={CARD}>
              <dt className={LABEL}>Correo electrónico</dt>
              <dd className={`${VALUE} break-words`}>
                {supplier?.Email ? (
                  <a href={emailHref} className="underline underline-offset-2">
                    {supplier.Email}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>

            <div className={CARD}>
              <dt className={LABEL}>Teléfono</dt>
              <dd className={VALUE}>
                {supplier?.PhoneNumber ? (
                  <a href={telHref} className="underline underline-offset-2">
                    {supplier.PhoneNumber}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>

            <div className={CARD}>
              <dt className={LABEL}>Estado</dt>
              <dd
                className={`${VALUE} font-semibold ${
                  supplier?.IsActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {supplier?.IsActive ? "Activo" : "Inactivo"}
              </dd>
            </div>

            <div className={`${CARD} sm:col-span-2`}>
              <dt className={LABEL}>Ubicación</dt>
              <dd className={`${VALUE} whitespace-pre-wrap`}>
                {supplier?.Location ? (
                  <address className="not-italic">{supplier.Location}</address>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>

          {/* Footer */}
          <footer className={FOOTER}>
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 bg-gray-200 hover:bg-gray-300"
            >
              Cerrar
            </button>
          </footer>
        </section>
      </div>
    </ModalBase>
  );
}
