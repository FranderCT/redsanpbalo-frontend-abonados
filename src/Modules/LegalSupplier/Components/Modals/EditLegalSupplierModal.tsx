import { useEffect, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import type { LegalSupplier } from "../../Models/LegalSupplier";
import { useEditLegalSupplier } from "../../Hooks/LegalSupplierHooks";
import { EditLegalSupplierSchema } from "../../Schemas/LegalSupplierSchema";

const limpiar = (ced: string) => ced.replace(/\D/g, "");
const esCedulaJuridica = (digits: string) =>
  digits.length === 10 && /^[34]/.test(digits);
const formatearCedulaJuridica = (raw: string) => {
  const d = limpiar(raw).slice(0, 10);
  if (d.length <= 1) return d;
  if (d.length <= 4) return `${d.slice(0, 1)}-${d.slice(1)}`;
  return `${d.slice(0, 1)}-${d.slice(1, 4)}-${d.slice(4)}`;
};

async function fetchNombreJuridico(
  ced: string,
  signal?: AbortSignal
): Promise<string | null> {
  const digits = limpiar(ced);
  if (!esCedulaJuridica(digits)) return null;
  const tryFetch = async (url: string) => {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error("HTTP");
    return res.json();
  };
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
  try {
    const d = await tryFetch(
      `https://api.hacienda.go.cr/fe/ae?identificacion=${digits}`
    );
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

type Props = {
  supplier: LegalSupplier;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function EditLegalSupplierModal({
  supplier,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [lookingUp, setLookingUp] = useState(false);
  const lookupRef = useRef<{
    timer: ReturnType<typeof setTimeout> | null;
    abort?: AbortController;
  }>({ timer: null });
  const updateMutation = useEditLegalSupplier();
  const s = supplier?.Supplier;

  const form = useForm({
    defaultValues: {
      LegalID: s?.IDcard ?? "",
      CompanyName: s?.Name ?? "",
      Email: s?.Email ?? "",
      PhoneNumber: s?.PhoneNumber ?? "",
      Location: s?.Location ?? "",
      WebSite: supplier?.WebSite ?? "",
      IsActive: s?.IsActive ?? true,
    },
    validators: { onChange: EditLegalSupplierSchema },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync({ id: supplier.Id, data: value });
        form.reset();
        onSuccess?.();
        onClose();
      } catch (err) {
        console.error("Error al actualizar el proveedor", err);
      }
    },
  });

  useEffect(() => {
    if (!supplier || !open) return;
    form.setFieldValue("LegalID", s?.IDcard ?? "");
    form.setFieldValue("CompanyName", s?.Name ?? "");
    form.setFieldValue("Email", s?.Email ?? "");
    form.setFieldValue("PhoneNumber", s?.PhoneNumber ?? "");
    form.setFieldValue("Location", s?.Location ?? "");
    form.setFieldValue("WebSite", supplier.WebSite ?? "");
    form.setFieldValue("IsActive", s?.IsActive ?? true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier, open]);

  const handleClose = () => {
    toast.warning("Edición cancelada", {
      position: "top-right",
      autoClose: 3000,
    });
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="flex max-h-[70vh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Editar proveedor jurídico</DialogTitle>
          <DialogDescription>
            Actualice la información del proveedor.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-legal-supplier-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <div className="flex flex-col gap-4">
          <form.Field name="LegalID">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && field.state.meta.errors.length > 0;
              return (
                <FieldGroup className="gap-2">
                  <Field>
                    <FieldLabel>Número de cédula jurídica</FieldLabel>
                    <Input
                      placeholder="ejm. 3-101-354271"
                      value={field.state.value}
                      onChange={(e) => {
                        const formatted = formatearCedulaJuridica(e.target.value);
                        field.handleChange(formatted);
                        if (lookupRef.current.timer)
                          clearTimeout(lookupRef.current.timer);
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
                            const nombre = await fetchNombreJuridico(
                              digits,
                              ac.signal
                            );
                            form.setFieldValue("CompanyName", nombre ?? "");
                          } finally {
                            setLookingUp(false);
                          }
                        }, 400);
                      }}
                      onBlur={async () => {
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
                          const nombre = await fetchNombreJuridico(
                            digits,
                            ac.signal
                          );
                          form.setFieldValue("CompanyName", nombre ?? "");
                        } finally {
                          setLookingUp(false);
                        }
                      }}
                      maxLength={12}
                      inputMode="numeric"
                      autoComplete="off"
                      className={isInvalid ? "border-destructive" : ""}
                    />
                    {lookingUp && (
                      <span className="text-xs text-muted-foreground">
                        Consultando…
                      </span>
                    )}
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                </FieldGroup>
              );
            }}
          </form.Field>

          <form.Field name="CompanyName">
            {(field) => (
              <FieldGroup className="gap-2">
                <Field>
                  <FieldLabel>Nombre del proveedor jurídico</FieldLabel>
                  <Input
                    placeholder="Se autocompleta según la cédula jurídica"
                    value={field.state.value}
                    readOnly
                    disabled
                    className="opacity-75 cursor-not-allowed"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              </FieldGroup>
            )}
          </form.Field>

          <form.Field name="Email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && field.state.meta.errors.length > 0;
              return (
                <FieldGroup className="gap-2">
                  <Field>
                    <FieldLabel>Correo electrónico</FieldLabel>
                    <Input
                      type="email"
                      placeholder="ejm. contacto@proveedora.com"
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

          <form.Field name="WebSite">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && field.state.meta.errors.length > 0;
              return (
                <FieldGroup className="gap-2">
                  <Field>
                    <FieldLabel>Sitio web</FieldLabel>
                    <Input
                      type="url"
                      placeholder="ejm. https://www.proveedora.com"
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

          <form.Field name="Location">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && field.state.meta.errors.length > 0;
              return (
                <FieldGroup className="gap-2">
                  <Field>
                    <FieldLabel>Dirección</FieldLabel>
                    <Textarea
                      placeholder="ejm. 150 m este del Banco Nacional, Carmona"
                      rows={4}
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

          <form.Field name="IsActive">
            {(field) => (
              <FieldGroup className="gap-2">
                <Field>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="edit-legal-is-active"
                      checked={!!field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="h-4 w-4 rounded border-input"
                    />
                    <FieldLabel
                      htmlFor="edit-legal-is-active"
                      className="cursor-pointer font-normal"
                    >
                      Proveedor activo
                    </FieldLabel>
                  </div>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              </FieldGroup>
            )}
          </form.Field>
            </div>
          </div>
        </form>

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
                  form="edit-legal-supplier-form"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Guardando…" : "Guardar cambios"}
                </Button>
              </div>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
