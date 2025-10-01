import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { useCreateLegalSupplier } from "../../Hooks/LegalSupplierHooks";

const CreateLegalSupplierModal = () => {
  const [open, setOpen] = useState(false);
  const CreateSupplierMutation = useCreateLegalSupplier();

  const SPANSTYLES = "text text-[#222]";
  const LABELSTYLES = "grid gap-1";
  const INPUTSTYLES = "w-full px-4 py-2 bg-gray-50 border";

  // -------- Helpers SOLO JURÍDICAS --------
  const limpiar = (ced: string) => ced.replace(/\D/g, "");

  const esCedulaJuridica = (digits: string) =>
    digits.length === 10 && /^[34]/.test(digits); 

  
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
      LegalID: "",
      CompanyName: "",
      Email: "",
      PhoneNumber: "",
      Location: "",
      WebSite: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await CreateSupplierMutation.mutateAsync({
          ...value,
          // Enviar LegalID sin guiones al backend, si así lo necesitas:
          LegalID: limpiar(value.LegalID),
        });
        form.reset();
        setOpen(false);
      } catch (err) {
        console.error("Error al crear el proveedor:", err);
        toast.error("No se pudo crear el proveedor", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  const handleClose = () => {
    toast.warning("Creación cancelada", { position: "top-right", autoClose: 3000 });
    setOpen(false);
    form.reset();
  };

  // -------- Handlers de LegalID (formateo + lookup) --------
  const handleLegalIdChange =
    (field: any, form: any) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Formatear mientras escribe
      const formatted = formatearCedulaJuridica(e.target.value);
      field.handleChange(formatted);

      // Si ya hay nombre manual (no aplica en este caso porque lo deshabilitamos), no autocompletar
      const currentName = form.getFieldValue("CompanyName");
      if (currentName && currentName.trim().length > 0) {

      }

      // Debounce
      if (lookupRef.current.timer) clearTimeout(lookupRef.current.timer);

      lookupRef.current.timer = setTimeout(async () => {
        // Cancelar request anterior
        lookupRef.current.abort?.abort();
        const ac = new AbortController();
        lookupRef.current.abort = ac;

        const digits = limpiar(formatted);
        if (!esCedulaJuridica(digits)) return;

        setLookingUp(true);
        try {
          const nombre = await fetchNombreJuridico(formatted, ac.signal);
          if (nombre) form.setFieldValue("CompanyName", nombre);
        } finally {
          setLookingUp(false);
        }
      }, 400);
    };

  const handleLegalIdBlur =
    (field: any, form: any) =>
    async () => {
      const raw = field.state.value;

      // Cancelar request anterior
      lookupRef.current.abort?.abort();
      const ac = new AbortController();
      lookupRef.current.abort = ac;

      const digits = limpiar(raw);
      if (!esCedulaJuridica(digits)) return;

      setLookingUp(true);
      try {
        const nombre = await fetchNombreJuridico(raw, ac.signal);
        if (nombre) form.setFieldValue("CompanyName", nombre);
      } finally {
        setLookingUp(false);
      }
    };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
      >
        + Crear proveedor jurídico
      </button>

      <ModalBase open={open} onClose={handleClose} panelClassName="w-[min(30vw,700px)] p-4 ">
        <header className="flex flex-col">
          <h2 className="text-2xl text-[#091540] font-bold">Crear proveedor jurídico</h2>
          <p className="text-md">Complete la información para crear un proveedor jurídico</p>
        </header>

        <div className="border-b border-[#222]/10 my-2" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="grid gap-3"
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
                  onChange={handleLegalIdChange(field, form)}
                  onBlur={handleLegalIdBlur(field, form)}
                  maxLength={13} // 1-3-6 => 10 dígitos + 2 guiones = 12; dejamos 13 por seguridad
                  inputMode="numeric"
                  autoComplete="off"
                />
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
              </label>
            )}
          </form.Field>

          {/* Email */}
          <form.Field name="Email">
            {(field) => (
              <label className={LABELSTYLES}>
                <span className={SPANSTYLES}>Correo electrónico del proveedor</span>
                <input
                  className={INPUTSTYLES}
                  placeholder="ejm. contacto@proveedor.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          </form.Field>

          {/* PhoneNumber */}
          <form.Field name="PhoneNumber">
            {(field) => (
              <>
                <PhoneField
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val ?? "")}
                  defaultCountry="CR"
                  required
                  error={
                    field.state.meta.isTouched && field.state.meta.errors[0]
                      ? String(field.state.meta.errors[0])
                      : undefined
                  }
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                  </p>
                )}
              </>
            )}
          </form.Field>

          {/* Location */}
          <form.Field name="Location">
            {(field) => (
              <label className={LABELSTYLES}>
                <span className={SPANSTYLES}>Dirección del proveedor</span>
                <textarea
                  className={`${INPUTSTYLES} resize-none min-h-[70px] leading-relaxed`}
                  placeholder="ejm. 150 metros este del Banco Nacional en Carmona"
                  rows={4}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          </form.Field>

          {/* WebSite */}
          <form.Field name="WebSite">
            {(field) => (
              <label className={LABELSTYLES}>
                <span className={SPANSTYLES}>Sitio web del proveedor</span>
                <input
                  className={INPUTSTYLES}
                  placeholder="ejm. www.proveedor.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          </form.Field>

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="submit"
                  className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "Registrando…" : "Registrar"}
                </button>
                <button type="button" onClick={handleClose} className="h-10 px-4 bg-gray-200 hover:bg-gray-300">
                  Cancelar
                </button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </ModalBase>
    </>
  );
};

export default CreateLegalSupplierModal;
