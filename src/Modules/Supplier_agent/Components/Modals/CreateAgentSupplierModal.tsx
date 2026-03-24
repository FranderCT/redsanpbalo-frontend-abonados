import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { useCreateAgentSupplier } from "../../Hooks/SupplierAgentHooks";
import { SupplierAgentSchema } from "../../Schemas/SupplierAgentSchema";

type Props = {
  LegalSupplierId?: number;
  onSuccess?: () => void;
};

type CedulaLookup = {
  name: string | null;
  surname1: string | null;
  surname2: string | null;
};

function splitCostaRicaFullName(full: string): CedulaLookup {
  const clean = full.replace(/\s+/g, " ").replace(/[.,]+/g, " ").trim();
  if (!clean) return { name: null, surname1: null, surname2: null };
  const parts = clean.split(" ").filter(Boolean);
  if (parts.length === 1) return { name: parts[0], surname1: null, surname2: null };
  if (parts.length === 2) return { name: parts[0], surname1: parts[1], surname2: null };
  const surname2 = parts.pop()!;
  const surname1 = parts.pop()!;
  const name = parts.join(" ");
  return { name, surname1, surname2 };
}

const limpiar = (v: string) => v.replace(/\D/g, "");

async function fetchPersonaFisica(
  cedula: string,
  signal?: AbortSignal
): Promise<CedulaLookup | null> {
  const c = limpiar(cedula);
  if (c.length < 9) return null;
  const res = await fetch(`https://apis.gometa.org/cedulas/${c}`, { signal });
  if (!res.ok) throw new Error("No se encontró este número de cédula");
  const data = await res.json();
  if (data?.results && data.results.length > 0) {
    const person = data.results[0];
    const fn1 = (person.firstname || "").trim().replace(/\s+/g, " ");
    const fn2 = (person.firstname2 || "").trim();
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const nombre =
      fn2 && new RegExp(`\\b${esc(fn2)}\\b`, "i").test(fn1)
        ? fn1
        : [fn1, fn2].filter(Boolean).join(" ").trim();
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
  const posibleFull =
    data?.nombre_completo ??
    data?.fullname ??
    data?.completo ??
    data?.razon_social ??
    null;
  if (typeof posibleFull === "string") return splitCostaRicaFullName(posibleFull);
  return null;
}

export default function CreateAgentSupplierModal({
  LegalSupplierId,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const lookupRef = useRef<{
    timer: ReturnType<typeof setTimeout> | null;
    abort?: AbortController;
  }>({ timer: null });
  const createMutation = useCreateAgentSupplier();

  const form = useForm({
    defaultValues: {
      IDcard: "",
      Name: "",
      Surname1: "",
      Surname2: "",
      Email: "",
      PhoneNumber: "",
      LegalSupplierId: LegalSupplierId ?? 0,
    },
    validators: { onChange: SupplierAgentSchema },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({
          ...value,
          LegalSupplierId: LegalSupplierId ?? value.LegalSupplierId,
        });
        form.reset({ ...form.state.values, LegalSupplierId: LegalSupplierId ?? 0 });
        setOpen(false);
        onSuccess?.();
      } catch (err) {
        console.error("Error al crear el agente", err);
      }
    },
  });

  const handleClose = () => {
    toast.warning("Registro cancelado", { position: "top-right", duration: 3000 });
    setOpen(false);
    form.reset();
  };

  const handleIdCardChange =
    (field: { handleChange: (v: string) => void; state: { value: string } }, formApi: typeof form) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      field.handleChange(raw);
      if (lookupRef.current.timer) clearTimeout(lookupRef.current.timer);
      lookupRef.current.abort?.abort();
      const c = limpiar(raw);
      if (c.length === 0 || c.length < 9) {
        formApi.setFieldValue("Name", "");
        formApi.setFieldValue("Surname1", "");
        formApi.setFieldValue("Surname2", "");
        return;
      }
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
        } catch {
          formApi.setFieldValue("Name", "");
          formApi.setFieldValue("Surname1", "");
          formApi.setFieldValue("Surname2", "");
        } finally {
          setLookingUp(false);
        }
      }, 400);
    };

  const handleIdCardBlur =
    (field: { state: { value: string } }, formApi: typeof form) =>
    async () => {
      const raw = field.state.value;
      lookupRef.current.abort?.abort();
      const c = limpiar(raw);
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
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) form.reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm">+ Agregar agente</Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[70vh] max-w-xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Crear agente</DialogTitle>
          <DialogDescription>
            Complete la información para crear un agente del proveedor.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-agent-supplier-form"
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
            <div className="flex flex-col gap-4">
              <form.Field name="IDcard">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && field.state.meta.errors.length > 0;
                  return (
                    <FieldGroup className="gap-2">
                      <Field>
                        <FieldLabel>Número de cédula del agente</FieldLabel>
                        <Input
                          placeholder="ejm. 504440503"
                          value={field.state.value}
                          onChange={handleIdCardChange(field, form)}
                          onBlur={handleIdCardBlur(field, form)}
                          inputMode="numeric"
                          autoComplete="off"
                          className={isInvalid ? "border-destructive" : ""}
                        />
                        {lookingUp && (
                          <span className="text-xs text-muted-foreground">
                            Consultando datos…
                          </span>
                        )}
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    </FieldGroup>
                  );
                }}
              </form.Field>

              <form.Field name="Name">
                {(field) => (
                  <FieldGroup className="gap-2">
                    <Field>
                      <FieldLabel>Nombre</FieldLabel>
                      <Input
                        placeholder="Se autocompleta según cédula"
                        value={field.state.value}
                        readOnly
                        disabled
                        className="bg-muted opacity-75"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  </FieldGroup>
                )}
              </form.Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <form.Field name="Surname1">
                  {(field) => (
                    <FieldGroup className="gap-2">
                      <Field>
                        <FieldLabel>Primer apellido</FieldLabel>
                        <Input
                          placeholder="Se autocompleta"
                          value={field.state.value}
                          readOnly
                          disabled
                          className="bg-muted opacity-75"
                        />
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    </FieldGroup>
                  )}
                </form.Field>
                <form.Field name="Surname2">
                  {(field) => (
                    <FieldGroup className="gap-2">
                      <Field>
                        <FieldLabel>Segundo apellido</FieldLabel>
                        <Input
                          placeholder="Se autocompleta"
                          value={field.state.value}
                          readOnly
                          disabled
                          className="bg-muted opacity-75"
                        />
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    </FieldGroup>
                  )}
                </form.Field>
              </div>

              <form.Field name="Email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && field.state.meta.errors.length > 0;
                  return (
                    <FieldGroup className="gap-2">
                      <Field>
                        <FieldLabel>Correo electrónico del agente</FieldLabel>
                        <Input
                          type="email"
                          placeholder="ejm. joseroman02@gmail.com"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={isInvalid ? "border-destructive" : ""}
                        />
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    </FieldGroup>
                  );
                }}
              </form.Field>

              <form.Field name="PhoneNumber">
                {(field) => (
                  <FieldGroup className="gap-2">
                    <Field>
                      <FieldLabel>Teléfono</FieldLabel>
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
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  </FieldGroup>
                )}
              </form.Field>
            </div>
          </div>

          <DialogFooter className="shrink-0 flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="flex w-full flex-col-reverse items-center justify-between gap-2 sm:flex-row-reverse">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={handleClose}
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    form="create-agent-supplier-form"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Registrando…" : "Registrar"}
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
