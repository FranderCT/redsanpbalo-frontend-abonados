import { useState } from "react";
import { useForm } from "@tanstack/react-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useCreateUser } from "../../../Auth/Hooks/AuthHooks";
import { AdminUserInitialState, TypeDNI } from "../../../Auth/Models/RegisterUser";
import { useGetAllRoles } from "../../Hooks/UsersHooks";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { AddUserSchema } from "../../schemas/AddUserSchema";

const isValidDateValue = (value: unknown): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime());

const toDateInputValue = (value: unknown) => {
  if (typeof value === "string") return value;
  if (isValidDateValue(value)) return value.toISOString().split("T")[0];
  return "";
};

const ID_LABELS: Record<string, { label: string; placeholder: string }> = {
  [TypeDNI.Cedula]:    { label: "Cédula",                     placeholder: "Cédula" },
  [TypeDNI.Pasaporte]: { label: "Número de pasaporte",         placeholder: "Número de pasaporte" },
  [TypeDNI.Otro]:      { label: "Número de identificación",    placeholder: "Número de identificación" },
};

export default function RegisterAbonadosModal() {
  const [open, setOpen] = useState(false);
  const [tempNis, setTempNis] = useState("");
  const createUserMutation = useCreateUser();
  const { roles } = useGetAllRoles();

  const form = useForm({
    defaultValues: AdminUserInitialState,
    validators: {
      onChange: AddUserSchema,
      onSubmit: AddUserSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { IsAbonado, ...userData } = value;
        await createUserMutation.mutateAsync(userData);
        toast.success("¡Registro exitoso!", { position: "top-right", duration: 3000 });
        setOpen(false);
        form.reset();
      } catch (error: any) {
        console.log("error", error);
        toast.error("¡Registro denegado!", { position: "top-right", duration: 3000 });
        form.reset();
      }
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">+ Agregar Usuario</Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[85vh] max-w-xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Crear cuenta</DialogTitle>
          <DialogDescription>
            Complete los datos para registrar un nuevo usuario.
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-user-form"
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
            <FieldGroup className="gap-4">

              {/* Tipo de identificación */}
              <FieldGroup className="gap-2">
                <form.Field name="TypeDNI">
                  {(field) => (
                    <Field className="gap-2">
                      <FieldLabel htmlFor="type-dni">Tipo de identificación</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) => {
                          field.handleChange(v as TypeDNI);
                          // Limpiar campos al cambiar tipo
                          form.setFieldValue("IDcard", "");
                          form.setFieldValue("Name", "");
                          form.setFieldValue("Surname1", "");
                          form.setFieldValue("Surname2", "");
                        }}
                      >
                        <SelectTrigger id="type-dni">
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TypeDNI.Cedula}>Cédula</SelectItem>
                          <SelectItem value={TypeDNI.Pasaporte}>Pasaporte</SelectItem>
                          <SelectItem value={TypeDNI.Otro}>Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {field.state.value === TypeDNI.Cedula
                          ? "El nombre se cargará automáticamente al ingresar la cédula."
                          : "Deberá ingresar el nombre y apellidos manualmente."}
                      </p>
                    </Field>
                  )}
                </form.Field>
              </FieldGroup>

              {/* IDcard + Nombre/Apellidos (condicional según TypeDNI) */}
              <form.Subscribe selector={(s) => s.values.TypeDNI}>
                {(typeDNI) => {
                  const isCedula = typeDNI === TypeDNI.Cedula;
                  const idMeta = ID_LABELS[typeDNI] ?? ID_LABELS[TypeDNI.Cedula];

                  return (
                    <>
                      {/* Número de identificación */}
                      <FieldGroup className="gap-2">
                        <form.Field name="IDcard">
                          {(field) => {
                            const isInvalid =
                              field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid} className="gap-2">
                                <FieldLabel htmlFor={field.name}>{idMeta.label}</FieldLabel>
                                <Input
                                  id={field.name}
                                  name={field.name}
                                  placeholder={idMeta.placeholder}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={async (e) => {
                                    const value = e.target.value;
                                    field.handleChange(value);

                                    // Solo buscar en la API para cédulas costarricenses
                                    if (isCedula && value.length >= 9) {
                                      try {
                                        const res = await fetch(
                                          `https://apis.gometa.org/cedulas/${value}`
                                        );
                                        if (!res.ok) throw new Error("No se encontró este número de cédula");
                                        const data = await res.json();
                                        if (data?.results?.length > 0) {
                                          const person = data.results[0];
                                          const apellido1 = person.lastname1 || "";
                                          const apellido2 = person.lastname2 || "";
                                          const fn1 = (person.firstname || "").trim().replace(/\s+/g, " ");
                                          const fn2 = (person.firstname2 || "").trim();
                                          const esc = (s: string) =>
                                            s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                                          const nombre =
                                            fn2 && new RegExp(`\\b${esc(fn2)}\\b`, "i").test(fn1)
                                              ? fn1
                                              : [fn1, fn2].filter(Boolean).join(" ").trim();
                                          form.setFieldValue("Name", nombre);
                                          form.setFieldValue("Surname1", apellido1);
                                          form.setFieldValue("Surname2", apellido2);
                                        }
                                      } catch (err) {
                                        console.warn("Error buscando cédula:", err);
                                        form.setFieldValue("Name", "");
                                        form.setFieldValue("Surname1", "");
                                        form.setFieldValue("Surname2", "");
                                      }
                                    }
                                  }}
                                  aria-invalid={isInvalid}
                                />
                                {isInvalid && (
                                  <FieldError errors={field.state.meta.errors} />
                                )}
                              </Field>
                            );
                          }}
                        </form.Field>
                      </FieldGroup>

                      {/* Nombre */}
                      <FieldGroup className="gap-2">
                        <form.Field name="Name">
                          {(field) => {
                            const isInvalid =
                              field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid} className="gap-2">
                                <FieldLabel htmlFor={field.name}>
                                  Nombre{!isCedula && <span className="text-destructive ml-0.5">*</span>}
                                </FieldLabel>
                                <Input
                                  id={field.name}
                                  name={field.name}
                                  placeholder={isCedula ? "Se cargará automáticamente" : "Nombre"}
                                  value={field.state.value}
                                  disabled={isCedula}
                                  onBlur={field.handleBlur}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  className={isCedula ? "bg-muted" : ""}
                                  aria-invalid={isInvalid}
                                />
                                {isInvalid && (
                                  <FieldError errors={field.state.meta.errors} />
                                )}
                              </Field>
                            );
                          }}
                        </form.Field>
                      </FieldGroup>

                      {/* Apellidos */}
                      <FieldGroup className="gap-2">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <form.Field name="Surname1">
                            {(field) => {
                              const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid;
                              return (
                                <Field data-invalid={isInvalid} className="gap-2">
                                  <FieldLabel htmlFor={field.name}>
                                    Primer apellido{!isCedula && <span className="text-destructive ml-0.5">*</span>}
                                  </FieldLabel>
                                  <Input
                                    id={field.name}
                                    name={field.name}
                                    placeholder={isCedula ? "Se cargará automáticamente" : "Primer apellido"}
                                    value={field.state.value}
                                    disabled={isCedula}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={isCedula ? "bg-muted" : ""}
                                    aria-invalid={isInvalid}
                                  />
                                  {isInvalid && (
                                    <FieldError errors={field.state.meta.errors} />
                                  )}
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
                                    name={field.name}
                                    placeholder={isCedula ? "Se cargará automáticamente" : "Segundo apellido (opcional)"}
                                    value={field.state.value}
                                    disabled={isCedula}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={isCedula ? "bg-muted" : ""}
                                    aria-invalid={isInvalid}
                                  />
                                  {isInvalid && (
                                    <FieldError errors={field.state.meta.errors} />
                                  )}
                                </Field>
                              );
                            }}
                          </form.Field>
                        </div>
                      </FieldGroup>
                    </>
                  );
                }}
              </form.Subscribe>

              {/* Soy abonado */}
              <FieldGroup className="gap-2">
                <form.Field name="IsAbonado">
                  {(field) => (
                    <Field className="gap-2">
                      <label className="flex cursor-pointer select-none items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!!field.state.value}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            field.handleChange(checked);
                            if (!checked) form.setFieldValue("Nis", []);
                          }}
                          className="h-4 w-4 rounded border-input"
                        />
                        <FieldLabel className="cursor-pointer font-medium">
                          Soy abonado
                        </FieldLabel>
                      </label>
                    </Field>
                  )}
                </form.Field>
              </FieldGroup>

              {/* NIS */}
              <form.Subscribe selector={(s) => s.values.IsAbonado ?? false}>
                {(isAbonado) => (
                  <FieldGroup className="gap-2">
                    <form.Field name="Nis">
                      {(field) => {
                        const nisList: number[] = field.state.value ?? [];
                        const isInvalid =
                          field.state.meta.isTouched && !field.state.meta.isValid;
                        const addNis = () => {
                          const trimmed = tempNis.trim();
                          if (!trimmed || !/^\d{1,10}$/.test(trimmed)) {
                            toast.error("El NIS debe tener entre 1 y 10 dígitos numéricos");
                            return;
                          }
                          const nisNum = Number(trimmed);
                          if (nisList.includes(nisNum)) {
                            toast.warning("Este NIS ya está agregado");
                            return;
                          }
                          field.handleChange([...nisList, nisNum]);
                          setTempNis("");
                        };
                        const removeNis = (nis: number) =>
                          field.handleChange(nisList.filter((n) => n !== nis));

                        return (
                          <Field data-invalid={isInvalid} className="gap-2">
                            <FieldLabel>NIS (Números de identificación)</FieldLabel>
                            <div className="flex flex-wrap gap-2">
                              {nisList.length === 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {isAbonado ? "Agregue al menos un NIS" : "Sin NIS asignados"}
                                </span>
                              )}
                              {nisList.map((nis) => (
                                <span
                                  key={nis}
                                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground"
                                >
                                  <span className="truncate">{nis}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeNis(nis)}
                                    disabled={!isAbonado}
                                    className="flex h-4 w-4 flex-shrink-0 items-center justify-center disabled:opacity-50 hover:opacity-80"
                                    title="Quitar NIS"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                              <Input
                                type="text"
                                value={tempNis}
                                onChange={(e) => setTempNis(e.target.value.replace(/\D/g, ""))}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (isAbonado) addNis();
                                  }
                                }}
                                placeholder={
                                  isAbonado
                                    ? "Ingrese un NIS y presione Agregar"
                                    : "Marque 'Soy abonado' primero"
                                }
                                disabled={!isAbonado}
                                maxLength={10}
                                inputMode="numeric"
                                className={!isAbonado ? "bg-muted" : ""}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={addNis}
                                disabled={!isAbonado || !tempNis.trim()}
                              >
                                + Agregar
                              </Button>
                            </div>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    </form.Field>
                  </FieldGroup>
                )}
              </form.Subscribe>

              {/* Email */}
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
                          placeholder="Correo electrónico"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              {/* Teléfono */}
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
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              {/* Fecha de nacimiento */}
              <FieldGroup className="gap-2">
                <form.Field name="Birthdate">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Fecha de nacimiento</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="date"
                          value={toDateInputValue(field.state.value)}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const nextValue = e.target.value;
                            field.handleChange(
                              nextValue ? new Date(`${nextValue}T00:00:00`) : ("" as unknown as Date)
                            );
                          }}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              {/* Dirección */}
              <FieldGroup className="gap-2">
                <form.Field name="Address">
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
                          placeholder="Dirección del usuario"
                          className="min-h-[96px] resize-none"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              {/* Roles */}
              <FieldGroup className="gap-2">
                <form.Field name="roleIds">
                  {(field) => {
                    const selectedIds: number[] = field.state.value ?? [];
                    const notSelected = roles?.filter((r: any) => !selectedIds.includes(r.Id)) ?? [];
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    const removeRole = (id: number) =>
                      field.handleChange(selectedIds.filter((x) => x !== id));
                    const addRole = (id: number) =>
                      field.handleChange(Array.from(new Set([...selectedIds, id])));
                    const clearAll = () => field.handleChange([]);

                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel>Roles</FieldLabel>
                        <div className="flex flex-wrap gap-2">
                          {selectedIds.length === 0 && (
                            <span className="text-xs text-muted-foreground">Sin roles asignados.</span>
                          )}
                          {selectedIds.map((id) => {
                            const r = roles?.find((x: any) => x.Id === id);
                            return (
                              <span
                                key={id}
                                className="inline-flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1 text-sm"
                              >
                                <span className="truncate">{r?.Rolname ?? `ID ${id}`}</span>
                                <button
                                  type="button"
                                  onClick={() => removeRole(id)}
                                  className="hover:text-destructive"
                                  title="Quitar rol"
                                >
                                  ×
                                </button>
                              </span>
                            );
                          })}
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <Select
                            value=""
                            onValueChange={(v) => {
                              if (!v) return;
                              addRole(Number(v));
                            }}
                          >
                            <SelectTrigger
                              id="roleIds-select"
                              className="flex-1 min-w-0"
                              aria-invalid={isInvalid}
                            >
                              <SelectValue
                                placeholder={
                                  notSelected.length
                                    ? "Agregar rol…"
                                    : "No hay más roles disponibles"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {notSelected.map((r: any) => (
                                <SelectItem key={r.Id} value={String(r.Id)}>
                                  {r.Rolname}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedIds.length > 0 && (
                            <Button type="button" variant="outline" size="sm" onClick={clearAll}>
                              Quitar todos
                            </Button>
                          )}
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

            </FieldGroup>
          </div>

          <DialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="flex w-full gap-2 flex-col-reverse items-center justify-between sm:flex-row-reverse">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    form="add-user-form"
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
