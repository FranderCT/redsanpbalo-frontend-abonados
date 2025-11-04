import { useEffect, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import type { LegalSupplier } from "../../Models/LegalSupplier";
import { useEditLegalSupplier } from "../../Hooks/LegalSupplierHooks";
import { EditLegalSupplierSchema } from "../../Schemas/LegalSupplierSchema";

type Props = {
  supplier: LegalSupplier;   // Debe traer al menos Id y los campos a editar
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const EditLegalSupplierModal = ({ supplier, open, onClose, onSuccess }: Props) => {
  const updateSupplierMutation = useEditLegalSupplier();

  const SPANSTYLES = "text text-[#222]";
  const LABELSTYLES = "grid gap-1";
  const INPUTSTYLES = "w-full px-4 py-2 bg-gray-50 border";

   // -------- Helpers SOLO JURÍDICAS --------
    const limpiar = (ced: string) => ced.replace(/\D/g, "");
  
    const esCedulaJuridica = (digits: string) =>
      digits.length === 10 && /^[34]/.test(digits); // 10 dígitos y empieza en 3 o 4
  
    // Formateo en vivo: 1-3-6 => 3-101-354271
    const formatearCedulaJuridica = (raw: string) => {
      const d = limpiar(raw).slice(0, 10);
      if (d.length <= 1) return d;
      if (d.length <= 4) return `${d.slice(0, 1)}-${d.slice(1)}`;
      return `${d.slice(0, 1)}-${d.slice(1, 4)}-${d.slice(4)}`;
    };
  
    async function fetchNombreJuridico(ced: string, signal?: AbortSignal): Promise<string | null> {
      const digits = limpiar(ced);
      if (!esCedulaJuridica(digits)) return null;
  
      const tryFetch = async (url: string) => {
        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error("HTTP");
        return res.json();
      };
  
      // 1) GoMeta (proxy/cache de Hacienda)
      try {
        const d = await tryFetch(`https://apis.gometa.org/cedulas/${digits}`);
        const nombre: string =
          d?.razon_social ||
          d?.razonsocial ||
          d?.nombre_comercial ||
          d?.nombreComercial ||
          d?.nombre ||
          "";
        if (nombre?.trim()) return nombre.trim();
      } catch {}
  
      // 2) Hacienda directa
      try {
        const d = await tryFetch(`https://api.hacienda.go.cr/fe/ae?identificacion=${digits}`);
        const nombre: string =
          d?.razon_social ||
          d?.razonsocial ||
          d?.nombre_comercial ||
          d?.nombreComercial ||
          d?.nombre ||
          "";
        if (nombre?.trim()) return nombre.trim();
      } catch {}
  
      return null;
    }
  
    // -------- UX: lookup con debounce + abort --------
    const [lookingUp, setLookingUp] = useState(false);
    const lookupRef = useRef<{ timer: any; abort?: AbortController }>({ timer: null });

  const form = useForm({
    defaultValues: {
      LegalID: supplier?.LegalID ?? "",
      CompanyName: supplier?.CompanyName ?? "",
      Email: supplier?.Email ?? "",
      PhoneNumber: supplier?.PhoneNumber ?? "",
      Location: supplier?.Location ?? "",
      WebSite: supplier?.WebSite ?? "",
      IsActive: supplier?.IsActive ?? true,
    },
    validators: {
      onChange: EditLegalSupplierSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateSupplierMutation.mutateAsync({
          id: supplier.Id,
          data: value,
        });
        form.reset();
        onSuccess?.();
        onClose?.();
      } catch (err) {
        console.error("Error al actualizar el proveedor", err);
      }
    },
  });

  // Sincroniza el formulario cuando cambien supplier u open
  useEffect(() => {
    if (!supplier || !open) return;
    form.reset({
      LegalID: supplier.LegalID ?? "",
      CompanyName: supplier.CompanyName ?? "",
      Email: supplier.Email ?? "",
      PhoneNumber: supplier.PhoneNumber ?? "",
      Location: supplier.Location ?? "",
      WebSite: supplier.WebSite ?? "",
      IsActive: supplier.IsActive,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier, open]);

  const handleClose = () => {
    toast.warning("Edición cancelada", { position: "top-right", autoClose: 3000 });
    form.reset();
    onClose();
  };

  return (
    <ModalBase
      open={open}
      onClose={handleClose}
      panelClassName="w-[min(90vw,700px)] p-4 flex flex-col max-h-[90vh]"
    >
      <header className="flex-shrink-0 flex flex-col">
        <h2 className="text-2xl text-[#091540] font-bold">Editar proveedor jurídico</h2>
        <p className="text-md">Actualice la información del proveedor</p>
      </header>

      <div className="border-b border-[#222]/10 my-2" />

      <form
        id="update-legal-supplier-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex-1 min-h-0 px-2 py-2 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* LegalID */}
        <form.Field name="LegalID">
            {(field) => (
              <label className={LABELSTYLES}>
                <span className={SPANSTYLES}>Número de cédula jurídica del proveedor</span>
                <input
                  className={INPUTSTYLES}
                  placeholder="ejm. 3-101-354271"
                  value={field.state.value}
                  onChange={(e) => {
                    const formatted = formatearCedulaJuridica(e.target.value);
                    field.handleChange(formatted);

                    // ---- lookup con debounce usando solo dígitos ----
                    if (lookupRef.current.timer) clearTimeout(lookupRef.current.timer);
                    lookupRef.current.abort?.abort();

                    const digits = limpiar(formatted);
                    if (digits.length < 10) {
                      form.setFieldValue("CompanyName", "");
                      return;
                    }

                    lookupRef.current.timer = setTimeout(async () => {
                      lookupRef.current.abort?.abort();
                      const ac = new AbortController();
                      lookupRef.current.abort = ac;

                      if (!esCedulaJuridica(digits)) {
                        form.setFieldValue("CompanyName", "");
                        return;
                      }

                      setLookingUp(true);
                      try {
                        // consulta con dígitos; mostramos el nombre, pero mantenemos LegalID con guiones
                        const nombre = await fetchNombreJuridico(digits, ac.signal);
                        form.setFieldValue("CompanyName", nombre ?? "");
                      } finally {
                        setLookingUp(false);
                      }
                    }, 400);
                  }}
                  onBlur={async () => {
                    // cancelar request anterior
                    lookupRef.current.abort?.abort();

                    const digits = limpiar(field.state.value);
                    if (digits.length < 10 || !esCedulaJuridica(digits)) {
                      form.setFieldValue("CompanyName", "");
                      return;
                    }

                    const ac = new AbortController();
                    lookupRef.current.abort = ac;

                    setLookingUp(true);
                    try {
                      const nombre = await fetchNombreJuridico(digits, ac.signal);
                      form.setFieldValue("CompanyName", nombre ?? "");
                    } finally {
                      setLookingUp(false);
                    }
                  }}
                  maxLength={12}           // "3-101-354271" = 12 caracteres (con guiones)
                  inputMode="numeric"
                  autoComplete="off"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
                {lookingUp && <span className="text-xs text-gray-500 mt-1">Consultando…</span>}
              </label>
            )}
          </form.Field>

          {/* CompanyName (autocompletado, deshabilitado) */}
          <form.Field name="CompanyName">
            {(field) => (
              <label className={LABELSTYLES}>
                <span className={SPANSTYLES}>Nombre del proveedor jurídico</span>
                <input
                  className={`${INPUTSTYLES} opacity-75 cursor-not-allowed`}
                  placeholder="Se autocompleta según la cédula jurídica"
                  value={field.state.value}
                  onChange={() => {}}
                  readOnly
                  disabled
                  aria-disabled="true"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                      </p>
                )}
              </label>
            )}
          </form.Field>

        {/* Email */}
        <form.Field name="Email">
          {(field) => (
            <label className={LABELSTYLES}>
              <span className={SPANSTYLES}>Correo electrónico</span>
              <input
                type="email"
                className={INPUTSTYLES}
                placeholder="ejm. contacto@proveedora.com"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                </p>
              )}
            </label>
          )}
        </form.Field>

        {/* Teléfono (PhoneField) */}
        <form.Field name="PhoneNumber">
          {(field) => (
            <>
              <PhoneField
                value={field.state.value}
                onChange={(val) => field.handleChange(val ?? "")}
                defaultCountry="CR"
                error={
                  field.state.meta.isTouched && field.state.meta.errors[0]
                    ? String(field.state.meta.errors[0])
                    : undefined
                }
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {(field.state.meta.errors[0] as any)?.message ??
                    String(field.state.meta.errors[0])}
                </p>
              )}
            </>
          )}
        </form.Field>

        {/* WebSite */}
        <form.Field name="WebSite">
          {(field) => (
            <label className={LABELSTYLES}>
              <span className={SPANSTYLES}>Sitio web</span>
              <input
                type="url"
                className={INPUTSTYLES}
                placeholder="ejm. https://www.proveedora.com"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                </p>
              )}
            </label>
          )}
        </form.Field>

        {/* Dirección */}
        <form.Field name="Location">
          {(field) => (
            <label className={LABELSTYLES}>
              <span className={SPANSTYLES}>Dirección</span>
              <textarea
                className={`${INPUTSTYLES} resize-none min-h-[70px] leading-relaxed`}
                placeholder="ejm. 150 m este del Banco Nacional, Carmona"
                rows={4}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                </p>
              )}
            </label>
          )}
        </form.Field>

        {/* Estado */}
        <form.Field name="IsActive">
          {(field) => (
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <span className="text-sm text-gray-700">
                {field.state.value ? "Activo" : "Inactivo"}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={!!field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5"></div>
              </div>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {(field.state.meta.errors[0] as any)?.message ??
                    String(field.state.meta.errors[0])}
                </p>
              )}
            </label>
          )}
        </form.Field>
      </form>
      {/* Botones */}
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <div className="flex-shrink-0 mt-4 flex justify-end gap-2 border-t border-gray-200 pt-3">
              <button
                form="update-legal-supplier-form"
                type="submit"
                className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Guardando…" : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="h-10 px-4 bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          )}
        </form.Subscribe>
    </ModalBase>
  );
};

export default EditLegalSupplierModal;
