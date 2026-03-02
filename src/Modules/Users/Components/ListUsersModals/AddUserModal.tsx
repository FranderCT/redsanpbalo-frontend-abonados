import { useState } from "react";
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
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { FieldGroup } from "@/Components/ui/field";
import { useCreateUser } from "../../../Auth/Hooks/AuthHooks";
import { AdminUserInitialState } from "../../../Auth/Models/RegisterUser";
import { useGetAllRoles } from "../../Hooks/UsersHooks";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { AddUserSchema } from "../../schemas/AddUserSchema";

export default function RegisterAbonadosModal() {
  const [open, setOpen] = useState(false);
  const [tempNis, setTempNis] = useState("");
  const createUserMutation = useCreateUser();
  const { roles } = useGetAllRoles();

  const form = useForm({
    defaultValues: AdminUserInitialState,
    validators: {
      onChange: AddUserSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { IsAbonado, ...userData } = value;
        await createUserMutation.mutateAsync(userData);
        toast.success("¡Registro exitoso!", { position: "top-right", autoClose: 3000 });
        setOpen(false);
        form.reset();
      } catch (error: any) {
        console.log("error", error);
        toast.error("¡Registro denegado!", { position: "top-right", autoClose: 3000 });
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

      <DialogContent className="max-h-[90vh] max-w-xl gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Crear cuenta</DialogTitle>
          <DialogDescription>
            Complete los datos para registrar un nuevo usuario.
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-user-form"
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto overflow-x-hidden px-6 py-4">
            <FieldGroup className="gap-4">
            <form.Field name="IDcard">
              {(field) => (
                <label className="grid gap-1">
                  <span className="text-sm font-medium">Cédula</span>
                  <Input
                    placeholder="Cédula"
                    value={field.state.value}
                    onChange={async (e) => {
                      const cedula = e.target.value;
                      field.handleChange(cedula);
                      if (cedula.length >= 9) {
                        try {
                          const res = await fetch(
                            `https://apis.gometa.org/cedulas/${cedula}`
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
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {(field.state.meta.errors[0] as any)?.message ??
                        String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            <form.Field name="Name">
              {(field) => (
                <label className="grid gap-1">
                  <span className="text-sm font-medium">Nombre</span>
                  <Input
                    placeholder="Nombre"
                    value={field.state.value}
                    disabled
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-muted"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {(field.state.meta.errors[0] as any)?.message ??
                        String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <form.Field name="Surname1">
                {(field) => (
                  <label className="grid gap-1">
                    <span className="text-sm font-medium">Primer apellido</span>
                    <Input
                      placeholder="Primer apellido"
                      value={field.state.value}
                      disabled
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-muted"
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {(field.state.meta.errors[0] as any)?.message ??
                          String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </label>
                )}
              </form.Field>
              <form.Field name="Surname2">
                {(field) => (
                  <label className="grid gap-1">
                    <span className="text-sm font-medium">Segundo apellido</span>
                    <Input
                      placeholder="Segundo apellido"
                      value={field.state.value}
                      disabled
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-muted"
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {(field.state.meta.errors[0] as any)?.message ??
                          String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </label>
                )}
              </form.Field>
            </div>

            <div className="space-y-3">
              <form.Field name="IsAbonado">
                {(field) => (
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
                    <span className="text-sm font-medium">Soy abonado</span>
                  </label>
                )}
              </form.Field>

              <form.Subscribe selector={(s) => s.values.IsAbonado ?? false}>
                {(isAbonado) => (
                  <form.Field name="Nis">
                    {(field) => {
                      const nisList: number[] = field.state.value ?? [];
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
                        <div className="grid gap-2">
                          <span className="text-sm font-medium">
                            NIS (Números de identificación)
                          </span>
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
                          {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-destructive">
                              {(field.state.meta.errors[0] as any)?.message ??
                                String(field.state.meta.errors[0])}
                            </p>
                          )}
                        </div>
                      );
                    }}
                  </form.Field>
                )}
              </form.Subscribe>
            </div>

            <form.Field name="Email">
              {(field) => (
                <label className="grid gap-1">
                  <span className="text-sm font-medium">Correo electrónico</span>
                  <Input
                    type="email"
                    placeholder="Correo electrónico"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {(field.state.meta.errors[0] as any)?.message ??
                        String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

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
                    <p className="text-sm text-destructive">
                      {(field.state.meta.errors[0] as any)?.message ??
                        String(field.state.meta.errors[0])}
                    </p>
                  )}
                </>
              )}
            </form.Field>

            <form.Field name="Birthdate">
              {(field) => (
                <label className="grid gap-1">
                  <span className="text-sm font-medium">Fecha de nacimiento</span>
                  <Input
                    type="date"
                    value={
                      field.state.value
                        ? field.state.value instanceof Date
                          ? field.state.value.toISOString().split("T")[0]
                          : String(field.state.value)
                        : ""
                    }
                    onChange={(e) => field.handleChange(new Date(e.target.value))}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {(field.state.meta.errors[0] as any)?.message ??
                        String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            <form.Field name="Address">
              {(field) => (
                <label className="grid gap-1">
                  <span className="text-sm font-medium">Dirección</span>
                  <textarea
                    className="flex min-h-[96px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Dirección del usuario"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {(field.state.meta.errors[0] as any)?.message ??
                        String(field.state.meta.errors[0])}
                    </p>
                  )}
                </label>
              )}
            </form.Field>

            <form.Field name="roleIds">
              {(field) => {
                const selectedIds: number[] = field.state.value ?? [];
                const notSelected = roles?.filter((r: any) => !selectedIds.includes(r.Id)) ?? [];
                const removeRole = (id: number) =>
                  field.handleChange(selectedIds.filter((x) => x !== id));
                const addRole = (id: number) =>
                  field.handleChange(Array.from(new Set([...selectedIds, id])));
                const clearAll = () => field.handleChange([]);

                return (
                  <div className="grid gap-2">
                    <span className="text-sm font-medium">Roles</span>
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
                      <select
                        className="h-9 flex-1 min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        defaultValue=""
                        onChange={(e) => {
                          const v = e.currentTarget.value;
                          if (!v) return;
                          addRole(Number(v));
                          e.currentTarget.value = "";
                        }}
                      >
                        <option value="" disabled>
                          {notSelected.length ? "Agregar rol…" : "No hay más roles disponibles"}
                        </option>
                        {notSelected.map((r: any) => (
                          <option key={r.Id} value={String(r.Id)}>
                            {r.Rolname}
                          </option>
                        ))}
                      </select>
                      {selectedIds.length > 0 && (
                        <Button type="button" variant="outline" size="sm" onClick={clearAll}>
                          Quitar todos
                        </Button>
                      )}
                    </div>
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {(field.state.meta.errors[0] as any)?.message ??
                          String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>
            </FieldGroup>
          </div>

          <DialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="flex w-full flex-col-reverse items-center justify-between sm:flex-row-reverse">
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
