import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { useCreatePhysicalSupplier } from "../../Hooks/PhysicalSupplierHooks";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { toast } from "react-toastify";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { PhysicalSupplierSchema } from "../../Schemas/PhysicalSupplierSchema";

type CedulaLookup = {
  name: string | null;
  surname1: string | null;
  surname2: string | null;
};

const CreatePhysicalSupplierModal = () => {
  const [open, setOpen] = useState(false);
  const CreateSupplierMutation = useCreatePhysicalSupplier();

  const SPANSTYLES = "text text-[#222]";
  const LABELSTYLES = "grid gap-1";
  const INPUTSTYLES = "w-full px-4 py-2 bg-gray-50 border";

  // --- Helpers ---
  const limpiar = (v: string) => v.replace(/\D/g, ""); // solo dígitos

  async function fetchPersonaFisica(
    cedula: string,
    signal?: AbortSignal
  ): Promise<CedulaLookup | null> {
    const c = limpiar(cedula);
    if (c.length < 9) return null; // cédulas físicas suelen tener >= 9 dígitos

    const res = await fetch(`https://apis.gometa.org/cedulas/${c}`, { signal });
    if (!res.ok) throw new Error("No se encontró este número de cédula");

    const data = await res.json();

    // Nueva estructura: data.results[0]
    if (data?.results && data.results.length > 0) {
      const person = data.results[0];
      const nombre = [person.firstname, person.firstname2]
        .filter(Boolean)
        .join(" ")
        .trim();
      const apellido1 = person.lastname1 || "";
      const apellido2 = person.lastname2 || "";

      if (nombre || apellido1 || apellido2) {
        return {
          name: nombre || null,
          surname1: apellido1 || null,
          surname2: apellido2 || null,
        };
      }
    }

    return null;
  }

  // Debounce + cancelación
  const [lookingUp, setLookingUp] = useState(false);
  const lookupRef = useRef<{ timer: any; abort?: AbortController }>({ timer: null });

  const form = useForm({
    defaultValues: {
      IDcard: "",
      Name: "",
      Surname1: "",
      Surname2: "",
      Email: "",
      PhoneNumber: "",
      Location: "",
    },
    validators:{
        onChange:PhysicalSupplierSchema
    },
    onSubmit: async ({ value }) => {
      try {
        await CreateSupplierMutation.mutateAsync(value);
        form.reset();
        setOpen(false);
      } catch (err) {
        console.error("error al crear el proveedor", err);
      }
    },
  });

  const handleClose = () => {
    toast.warning("Registro cancelado", { position: "top-right", autoClose: 3000 });
    setOpen(false);
    form.reset();
  };

  // --- Handler del IDcard con autocompletado de Nombre ---
  const handleIdCardChange =
    (field: any, formApi: any) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      field.handleChange(raw);

      // cancelar timers/requests anteriores
      if (lookupRef.current.timer) clearTimeout(lookupRef.current.timer);
      lookupRef.current.abort?.abort();

      const c = limpiar(raw);

      // ✅ Si la cédula quedó vacía o es muy corta, limpiar inmediatamente y NO consultar
      if (c.length === 0 || c.length < 9) {
        formApi.setFieldValue("Name", "");
        formApi.setFieldValue("Surname1", "");
        formApi.setFieldValue("Surname2", "");
        return;
      }

      // debounce
      lookupRef.current.timer = setTimeout(async () => {
        const ac = new AbortController();
        lookupRef.current.abort = ac;

        setLookingUp(true);
        try {
          const persona = await fetchPersonaFisica(raw, ac.signal);
          if (persona) {
            formApi.setFieldValue("Name", persona.name ?? "");
            formApi.setFieldValue("Surname1", persona.surname1 ?? "");
            formApi.setFieldValue("Surname2", persona.surname2 ?? "");
          } else {
            formApi.setFieldValue("Name", "");
            formApi.setFieldValue("Surname1", "");
            formApi.setFieldValue("Surname2", "");
          }
        } catch (err) {
          console.warn("Error buscando cédula:", err);
          formApi.setFieldValue("Name", "");
          formApi.setFieldValue("Surname1", "");
          formApi.setFieldValue("Surname2", "");
        } finally {
          setLookingUp(false);
        }
      }, 400);
    };

  const handleIdCardBlur =
    (field: any, formApi: any) =>
    async () => {
      const raw = field.state.value;

      // cancelar request anterior
      lookupRef.current.abort?.abort();

      const c = limpiar(raw);

      // ✅ Si está vacío o corto, no consultar y asegurar limpieza
      if (c.length === 0 || c.length < 9) {
        formApi.setFieldValue("Name", "");
        formApi.setFieldValue("Surname1", "");
        formApi.setFieldValue("Surname2", "");
        return;
      }

      const ac = new AbortController();
      lookupRef.current.abort = ac;

      setLookingUp(true);
      try {
        const persona = await fetchPersonaFisica(raw, ac.signal);
        if (persona) {
          formApi.setFieldValue("Name", persona.name ?? "");
          formApi.setFieldValue("Surname1", persona.surname1 ?? "");
          formApi.setFieldValue("Surname2", persona.surname2 ?? "");
        } else {
          formApi.setFieldValue("Name", "");
          formApi.setFieldValue("Surname1", "");
          formApi.setFieldValue("Surname2", "");
        }
      } catch {
        formApi.setFieldValue("Name", "");
        formApi.setFieldValue("Surname1", "");
        formApi.setFieldValue("Surname2", "");
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
        + Crear proveedor físico
      </button>

      <ModalBase open={open} onClose={handleClose} panelClassName="w-[min(90vw,700px)] p-4 flex flex-col max-h-[90vh]">
        <header className="flex-shrink-0 flex flex-col">
          <h2 className="text-2xl text-[#091540] font-bold">Crear proveedor físico</h2>
          <p className="text-md">Complete la información para crear un proveedor físico</p>
        </header>

        <div className="border-b border-[#222]/10"></div>

        <form
          id="create-physical-supplier-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex-1 min-h-0 px-2 py-2 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Cédula física */}
          <form.Field name="IDcard">
            {(field) => (
              <>
                <label className={LABELSTYLES}>
                  <span className={SPANSTYLES}>Número de cédula física del proveedor</span>
                  <input
                    className={INPUTSTYLES}
                    placeholder="ejm. 505550555"
                    value={field.state.value}
                    onChange={handleIdCardChange(field, form)}
                    onBlur={handleIdCardBlur(field, form)}
                    inputMode="numeric"
                    autoComplete="off"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                      </p>
                  )}
                </label>
                {lookingUp && <p className="text-xs text-gray-500 mt-1">Consultando nombre…</p>}
              </>
            )}
          </form.Field>

          {/* Nombre (autocompletado y deshabilitado) */}
          <form.Field name="Name">
              {(field) => (
              <>
                  <label className={LABELSTYLES}>
                  <span className={SPANSTYLES}>Nombre</span>
                  <input
                      className={`${INPUTSTYLES} opacity-75 cursor-not-allowed`}
                      placeholder="Se autocompleta según cédula"
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
              </>
              )}
          </form.Field>

          {/* Primer apellido (autocompletado) */}
          <form.Field name="Surname1">
              {(field) => (
              <>
                  <label className={LABELSTYLES}>
                  <span className={SPANSTYLES}>Primer apellido</span>
                  <input
                      className={`${INPUTSTYLES} opacity-75 cursor-not-allowed`}
                      placeholder="Se autocompleta según cédula"
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
              </>
              )}
          </form.Field>

          {/* Segundo apellido (autocompletado) */}
          <form.Field name="Surname2">
              {(field) => (
              <>
                  <label className={LABELSTYLES}>
                  <span className={SPANSTYLES}>Segundo apellido</span>
                  <input
                      className={`${INPUTSTYLES} opacity-75 cursor-not-allowed`}
                      placeholder="Se autocompleta según cédula"
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
              </>
              )}
          </form.Field>

          {/* Email */}
          <form.Field name="Email">
            {(field) => (
              <>
                <label className={LABELSTYLES}>
                  <span className={SPANSTYLES}>Correo electrónico del proveedor</span>
                  <input
                    className={INPUTSTYLES}
                    placeholder="ejm. proveedor@gmail.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                      </p>
                    )}
                </label>
              </>
            )}
          </form.Field>

          {/* Teléfono */}
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
                    {(field.state.meta.errors[0] as any)?.message ??
                      String(field.state.meta.errors[0])}
                  </p>
                )}
              </>
            )}
          </form.Field>

          {/* Dirección */}
          <form.Field name="Location">
            {(field) => (
              <>
                <label className={LABELSTYLES}>
                  <span className={SPANSTYLES}>Dirección del proveedor</span>
                  <textarea
                    className={`${INPUTSTYLES} resize-none min-h-[70px] leading-relaxed`}
                    placeholder="ejm. 150 metros este del banco nacional en Carmona"
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
              </>
            )}
          </form.Field>
        </form>
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <div className="flex-shrink-0 mt-4 flex justify-end gap-2 border-t border-gray-200 pt-3">
                <button
                  form="create-physical-supplier-form"
                  type="submit"
                  className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "Registrando…" : "Registrar"}
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
    </>
  );
};

export default CreatePhysicalSupplierModal;
