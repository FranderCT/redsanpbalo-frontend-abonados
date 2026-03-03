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
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { useUpdateUser, useGetAllRoles } from "../../Hooks/UsersHooks";
import type { User } from "../../Models/User";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { EditUserSchema } from "../../schemas/EditUserSchema";

type Props = {
  user: User;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function EditUserModal({ user, open, onClose, onSuccess }: Props) {
  const updateUserMutation = useUpdateUser();
  const { roles } = useGetAllRoles();
  const [tempNis, setTempNis] = useState("");

  const initialRoleIds =
    (Array.isArray((user as any)?.Roles) ? (user as any).Roles.map((r: any) => r.Id) : undefined) ??
    (Array.isArray((user as any)?.roleIds) ? (user as any).roleIds : []) ??
    [];

  const form = useForm({
    defaultValues: {
      PhoneNumber: user.PhoneNumber ?? "",
      Nis: user.Nis ?? [],
      Address: user.Address ?? "",
      roleIds: initialRoleIds as number[],
      IsActive: user.IsActive ?? true,
    },
    validators: {
      onChange: EditUserSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateUserMutation.mutateAsync({ id: user.Id, data: value });
        toast.success("¡Usuario actualizado!", { position: "top-right", autoClose: 3000 });
        formApi.reset();
        onClose();
        onSuccess?.();
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ?? err?.message ?? "No se pudo actualizar el usuario.";
        toast.error(msg, { position: "top-right", autoClose: 3000 });
      }
    },
  });

  const formatErrors = (errors: unknown[]) =>
    errors?.map((e) =>
      typeof e === "object" && e !== null && "message" in e
        ? { message: (e as { message: string }).message }
        : { message: String(e) }
    );

  const EditField = form.Field;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-h-[70vh] max-w-xl gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>
            Modifique los datos editables del usuario.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-user-form"
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto overflow-x-hidden px-6 py-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Información del usuario</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Nombre completo
                    </dt>
                    <dd className="mt-1 text-sm text-foreground break-words">
                      {`${user?.Name ?? ""} ${user?.Surname1 ?? ""} ${user?.Surname2 ?? ""}`.trim() ||
                        "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Correo electrónico
                    </dt>
                    <dd className="mt-1 text-sm text-foreground break-words">{user?.Email || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Cédula
                    </dt>
                    <dd className="mt-1 text-sm text-foreground break-words">{user?.IDcard || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      NIS
                    </dt>
                    <dd className="mt-1 text-sm text-foreground break-words">
                      {user?.Nis?.length ? user.Nis.join(", ") : "—"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <FieldGroup className="gap-4">
            <EditField name="Nis">
              {(field) => {
                const nisList: number[] = field.state.value ?? [];
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                const handleAddNis = () => {
                  const trimmed = tempNis.trim();
                  if (!trimmed) return;
                  const nisNum = Number(trimmed);
                  if (isNaN(nisNum) || nisNum <= 0) {
                    toast.error("El NIS debe ser un número positivo", {
                      position: "top-right",
                      autoClose: 2000,
                    });
                    return;
                  }
                  if (nisList.includes(nisNum)) {
                    toast.error("Este NIS ya está agregado", {
                      position: "top-right",
                      autoClose: 2000,
                    });
                    return;
                  }
                  field.handleChange([...nisList, nisNum]);
                  setTempNis("");
                };

                const handleRemoveNis = (nis: number) => {
                  field.handleChange(nisList.filter((n) => n !== nis));
                };

                return (
                  <Field data-invalid={isInvalid} className="gap-2">
                    <FieldLabel>
                      NIS (Números de Identificación de Servicio)
                    </FieldLabel>
                    <div className="flex min-h-[40px] flex-wrap gap-2 rounded-md border bg-muted/40 p-2">
                      {nisList.length === 0 && (
                        <span className="text-xs text-muted-foreground">
                          No hay NIS agregados
                        </span>
                      )}
                      {nisList.map((nis) => (
                        <span
                          key={nis}
                          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground"
                        >
                          {nis}
                          <button
                            type="button"
                            onClick={() => handleRemoveNis(nis)}
                            className="hover:text-destructive font-bold"
                            title="Eliminar NIS"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={tempNis}
                        onChange={(e) => setTempNis(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddNis();
                          }
                        }}
                        placeholder="Ingresa un NIS y presiona Enter"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                      <Button type="button" variant="secondary" onClick={handleAddNis}>
                        Agregar
                      </Button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={formatErrors(field.state.meta.errors)} />
                    )}
                  </Field>
                );
              }}
            </EditField>

            <EditField name="PhoneNumber">
              {(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  className="gap-2"
                >
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
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <FieldError errors={formatErrors(field.state.meta.errors)} />
                  )}
                </Field>
              )}
            </EditField>

            <EditField name="Address">
              {(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  className="gap-2"
                >
                  <FieldLabel>Dirección</FieldLabel>
                  <textarea
                    className="flex min-h-[96px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Dirección del usuario"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <FieldError errors={formatErrors(field.state.meta.errors)} />
                  )}
                </Field>
              )}
            </EditField>

            <EditField name="roleIds">
              {(field) => {
                const selectedIds: number[] = field.state.value ?? [];
                const notSelected = roles?.filter((r: any) => !selectedIds.includes(r.Id)) ?? [];

                const removeRole = (id: number) =>
                  field.handleChange(selectedIds.filter((x) => x !== id));
                const addRole = (id: number) =>
                  field.handleChange(Array.from(new Set([...selectedIds, id])));
                const clearAll = () => field.handleChange([]);

                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

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
                            {r?.Rolname ?? `ID ${id}`}
                            <button
                              type="button"
                              onClick={() => removeRole(id)}
                              className="text-muted-foreground hover:text-destructive"
                              title="Quitar rol"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
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
                    {isInvalid && (
                      <FieldError errors={formatErrors(field.state.meta.errors)} />
                    )}
                  </Field>
                );
              }}
            </EditField>

            <EditField name="IsActive">
              {(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  className="gap-2"
                >
                  <FieldLabel>Estado</FieldLabel>
                  <label className="flex cursor-pointer select-none items-center gap-3 text-sm text-foreground">
                    <span>{field.state.value ? "Activo" : "Inactivo"}</span>
                    <input
                      type="checkbox"
                      checked={!!field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="h-4 w-4 rounded border-input"
                    />
                  </label>
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <FieldError errors={formatErrors(field.state.meta.errors)} />
                  )}
                </Field>
              )}
            </EditField>
            </FieldGroup>
          </div>

          <DialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="flex w-full flex-col-reverse items-center justify-between sm:flex-row-reverse">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    form="edit-user-form"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Guardando…" : "Guardar cambios"}
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
