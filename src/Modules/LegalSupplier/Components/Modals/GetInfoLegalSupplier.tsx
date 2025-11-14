// Components/GetInfoLegalSupplierModal.tsx
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import type { LegalSupplier } from "../../Models/LegalSupplier";

type Props = {
  supplier: LegalSupplier;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function GetInfoLegalSupplierModal({
  supplier,
  open,
  onClose,
  onSuccess,
}: Props) {
  // ✅ Clases reutilizables
  const PANEL = "w-full max-w-2xl !p-0 overflow-hidden shadow-2xl";
  const WRAP = "bg-white";
  const HEADER = "px-6 py-5 border-b border-gray-200";
  const SECTION = "p-6";
  const GRID = "grid grid-cols-1 sm:grid-cols-2 gap-3";
  const CARD = "bg-gray-50 p-3";
  const LABEL = "text-[11px] uppercase text-gray-500";
  const VALUE = "mt-1 text-sm text-[#091540]";
  const FOOTER = "mt-6 flex justify-end";

  const show = (v?: string | number | null) =>
    v === null || v === undefined || v === "" ? "—" : String(v);

  const emailHref = supplier?.Supplier?.Email ? `mailto:${supplier.Supplier.Email}` : undefined;
  const telHref = supplier?.Supplier?.PhoneNumber ? `tel:${supplier.Supplier.PhoneNumber}` : undefined;
  const websiteHref = supplier?.WebSite ? supplier.WebSite : undefined;

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
          <p className="text-sm text-gray-600">Proveedor jurídico</p>
        </header>

        {/* Body */}
        <section className={SECTION} aria-labelledby="legal-supplier-info">
          <h4 id="legal-supplier-info" className="sr-only">
            Datos del proveedor jurídico
          </h4>

          <dl className={GRID}>
            <div className={CARD}>
              <dt className={LABEL}>ID interno</dt>
              <dd className={VALUE}>{show(supplier?.Id)}</dd>
            </div>

            <div className={CARD}>
              <dt className={LABEL}>Cédula jurídica</dt>
              <dd className={VALUE}>{show(supplier?.Supplier?.IDcard)}</dd>
            </div>

            <div className={CARD}>
              <dt className={LABEL}>Nombre de empresa</dt>
              <dd className={`${VALUE} break-words`}>{show(supplier?.Supplier?.Name)}</dd>
            </div>

            <div className={CARD}>
              <dt className={LABEL}>Correo electrónico</dt>
              <dd className={`${VALUE} break-words`}>
                {supplier?.Supplier?.Email ? (
                  <a href={emailHref} className="underline underline-offset-2">
                    {supplier.Supplier.Email}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>

            <div className={CARD}>
              <dt className={LABEL}>Teléfono</dt>
              <dd className={VALUE}>
                {supplier?.Supplier?.PhoneNumber ? (
                  <a href={telHref} className="underline underline-offset-2">
                    {supplier.Supplier.PhoneNumber}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>

            <div className={CARD}>
              <dt className={LABEL}>Sitio web</dt>
              <dd className={`${VALUE} break-words`}>
                {websiteHref ? (
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    {supplier.WebSite}
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
                  supplier?.Supplier?.IsActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {supplier?.Supplier?.IsActive ? "Activo" : "Inactivo"}
              </dd>
            </div>

            <div className={`${CARD} sm:col-span-2`}>
              <dt className={LABEL}>Ubicación</dt>
              <dd className={`${VALUE} whitespace-pre-wrap`}>
                {supplier?.Supplier?.Location ? (
                  <address className="not-italic">{supplier.Supplier.Location}</address>
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
