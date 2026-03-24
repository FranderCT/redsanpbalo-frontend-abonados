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
import { Textarea } from "@/Components/ui/textarea";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { useCreatePhysicalSupplier } from "../../Hooks/PhysicalSupplierHooks";
import { PhysicalSupplierSchema } from "../../Schemas/PhysicalSupplierSchema";

type CedulaLookup = {
  name: string | null;
  surname1: string | null;
  surname2: string | null;
};

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
  return null;
}

export default function CreatePhysicalSupplierModal() {
  const [open, setOpen] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const lookupRef = useRef<{ timer: ReturnType<typeof setTimeout> | null; abort?: AbortController }>({
    timer: null,
  });
  const createMutation = useCreatePhysicalSupplier();

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
    validators: { onChange: PhysicalSupplierSchema },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync(value);
        toast.success("Proveedor físico creado");
        form.reset();
        setOpen(false);
      } catch (err) {
        console.error("Error al crear el proveedor", err);
        toast.error("No se pudo crear el proveedor");
      }
    },
  });


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
        <Button className="w-full sm:w-auto">+ Crear proveedor</Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[70vh] max-w-xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Crear proveedor físico</DialogTitle>
          <DialogDescription>
            Complete la información para registrar un nuevo proveedor físico.
          </DialogDescription>
        </DialogHeader>
        <form
          id="create-physical-supplier-form"
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
            <div className="flex flex-col gap-4">
            <FieldGroup className="gap-4">
              <FieldGroup className="gap-2">
                <form.Field name="IDcard">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Número de cédula</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Ej: 505550555"
                          value={field.state.value}
                          onBlur={() => handleIdCardBlur(field, form)()}
                          onChange={handleIdCardChange(field, form)}
                          inputMode="numeric"
                          autoComplete="off"
                          aria-invalid={isInvalid}
                        />
                        {lookingUp && (
                          <p className="text-xs text-muted-foreground">Consultando nombre…</p>
                        )}
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              <FieldGroup className="gap-2">
                <form.Field name="Name">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                        <Input
                          id={field.name}
                          value={field.state.value}
                          disabled
                          className="bg-muted"
                          placeholder="Se autocompleta según cédula"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <form.Field name="Surname1">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Primer apellido</FieldLabel>
                        <Input
                          id={field.name}
                          value={field.state.value}
                          disabled
                          className="bg-muted"
                          placeholder="Se autocompleta"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="Surname2">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Segundo apellido</FieldLabel>
                        <Input
                          id={field.name}
                          value={field.state.value}
                          disabled
                          className="bg-muted"
                          placeholder="Se autocompleta"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <FieldGroup className="gap-2">
                <form.Field name="Email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Correo electrónico</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          placeholder="proveedor@ejemplo.com"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              <FieldGroup className="gap-2">
                <form.Field name="PhoneNumber">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <PhoneField
                          label="Teléfono"
                          value={field.state.value}
                          onChange={(val) => field.handleChange(val ?? "")}
                          defaultCountry="CR"
                          required
                          data-invalid={isInvalid}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              <FieldGroup className="gap-2">
                <form.Field name="Location">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Dirección</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Ej: 150 m este del banco nacional, Carmona"
                          rows={4}
                          className="min-h-[80px] resize-y"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </FieldGroup>
            </div>
          </div>
          <DialogFooter className="shrink-0 flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="flex w-full flex-col-reverse items-center justify-between gap-2 sm:flex-row-reverse">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    form="create-physical-supplier-form"
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
