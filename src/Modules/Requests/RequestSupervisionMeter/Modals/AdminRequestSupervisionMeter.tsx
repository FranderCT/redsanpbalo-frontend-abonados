import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { UserRound } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import type { AbonadoSearch } from "../../GeneralGetUser/Model";
import { useSearchAbonados } from "../../GeneralGetUser/GenralHook";
import { useCreateReqSupervisionMeter } from "../Hooks/ReqSupervisionMeterHooks";
import { CreateSupervisionMeterRequestSchema } from "../schemas/CreateSupervisionMeterRequestSchema";

const getFieldErrorMessage = (error: unknown) =>
  typeof error === "object" && error !== null && "message" in error
    ? String((error as { message?: string }).message ?? "Valor inválido")
    : String(error);

const useDebouncedValue = (val: string, delay = 400) => {
  const [debounced, setDebounced] = useState(val);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(val), delay);
    return () => clearTimeout(id);
  }, [val, delay]);
  return debounced;
};

function UserTypeahead({
  value,
  onChange,
}: {
  value?: number;
  onChange: (userId: number, picked?: AbonadoSearch) => void;
}) {
  const [input, setInput] = useState("");
  const [openList, setOpenList] = useState(false);
  const debounced = useDebouncedValue(input, 400);
  const { data: users = [], isPending } = useSearchAbonados(debounced);
  const selectedUser = users.find((u) => u.Id === value);

  return (
    <div className="relative">
      <Label className="mb-2 block">
        Abonado (buscar por cédula/NIS) <span className="text-red-500">*</span>
      </Label>
      <div className="flex items-center gap-2 border border-input bg-background px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
        <Input
          type="text"
          value={
            selectedUser
              ? `${selectedUser.IDcard ?? (Array.isArray(selectedUser.Nis) && selectedUser.Nis.length ? selectedUser.Nis.join(", ") : "")}`
              : input
          }
          onChange={(event) => {
            setInput(event.target.value);
            setOpenList(true);
          }}
          onFocus={() => setOpenList(true)}
          placeholder="Digite cédula, NIS o nombre…"
          className="h-auto border-0 px-0 py-0 shadow-none focus-visible:ring-0"
        />
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-none text-xs"
            onClick={() => {
              onChange(0, undefined);
              setInput("");
            }}
          >
            Limpiar
          </Button>
        ) : null}
      </div>

      {openList ? (
        <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto border border-slate-200 bg-white shadow-lg">
          {isPending ? <div className="p-3 text-sm text-slate-500">Buscando…</div> : null}
          {!isPending && users.length === 0 ? (
            <div className="p-3 text-sm text-slate-500">
              {input.trim() ? "Sin resultados" : "Escriba para buscar"}
            </div>
          ) : null}
          {!isPending
            ? users.map((u) => (
                <button
                  key={u.Id}
                  type="button"
                  onClick={() => {
                    onChange(u.Id, u);
                    setInput(u.IDcard || "");
                    setOpenList(false);
                  }}
                  className="w-full border-b border-slate-100 px-3 py-2 text-left hover:bg-slate-50 last:border-0"
                >
                  <div className="text-sm font-medium text-slate-900">{u.FullName}</div>
                  <div className="text-xs text-slate-500">
                    Cédula: {u.IDcard}
                    {Array.isArray(u.Nis) && u.Nis.length ? ` • NIS: ${u.Nis.join(", ")}` : ""}
                  </div>
                </button>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}

export default function CreateRequestSupervisionMeter2() {
  const createMutation = useCreateReqSupervisionMeter();
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      UserId: 0,
      Location: "",
      NIS: 0,
      Justification: "",
      _selectedUser: null as AbonadoSearch | null,
    },
    validators: {
      onChange: CreateSupervisionMeterRequestSchema,
      onSubmit: CreateSupervisionMeterRequestSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await createMutation.mutateAsync({
          UserId: value.UserId,
          Location: value.Location.trim(),
          NIS: Number(value.NIS),
          Justification: value.Justification.trim(),
        });

        toast.success("Solicitud creada correctamente");
        formApi.reset();
        setOpen(false);
      } catch (error) {
        console.error("Error al crear la solicitud de supervisión de medidor", error);
        toast.error("No se pudo crear la solicitud.");
      }
    },
  });

  const handleClose = () => {
    toast.warning("Solicitud cancelada", { position: "top-right", duration: 3000 });
    form.reset();
    setOpen(false);
  };

  return (
    <div>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-none bg-[#091540] text-white hover:bg-[#1789FC]"
      >
        + Solicitar Supervisión de Medidor
      </Button>

      <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden rounded-none border-slate-200 p-0">
          <DialogHeader className="border-b border-slate-200 px-8 py-6">
            <DialogTitle className="text-2xl text-[#091540]">
              Solicitud de Supervisión de Medidor
            </DialogTitle>
            <DialogDescription>
              Complete los datos del abonado y la justificación para registrar la solicitud.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-8 py-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <Card className="rounded-none border-slate-200 shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base text-[#091540]">
                    Datos del abonado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form.Field name="UserId">
                    {(field) => (
                      <UserTypeahead
                        value={field.state.value}
                        onChange={(userId, picked) => {
                          field.handleChange(userId);
                          form.setFieldValue("_selectedUser", picked ?? null);
                          if (picked && Array.isArray(picked.Nis)) {
                            if (picked.Nis.length === 1) {
                              form.setFieldValue("NIS", Number(picked.Nis[0]) || 0);
                            } else {
                              form.setFieldValue("NIS", 0);
                            }
                          } else {
                            form.setFieldValue("NIS", 0);
                          }
                        }}
                      />
                    )}
                  </form.Field>

                  <form.Field name="UserId">
                    {(field) =>
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 ? (
                        <p className="text-sm text-red-500">
                          {getFieldErrorMessage(field.state.meta.errors[0])}
                        </p>
                      ) : null
                    }
                  </form.Field>

                  <form.Subscribe selector={(state) => state.values._selectedUser}>
                    {(sel) =>
                      sel ? (
                        <div className="flex items-start gap-3 border border-slate-200 bg-slate-50 p-4">
                          <div className="flex h-10 w-10 items-center justify-center bg-[#091540]/10 text-[#091540]">
                            <UserRound className="h-5 w-5" />
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="font-medium text-slate-900">
                              {sel.FullName}
                            </div>
                            <div className="text-slate-600">
                              Cédula:{" "}
                              <span className="font-mono">{sel.IDcard ?? "—"}</span>
                              {Array.isArray(sel.Nis) && sel.Nis.length ? (
                                <>
                                  {" "}
                                  • NIS:{" "}
                                  <span className="font-mono">
                                    {sel.Nis.join(", ")}
                                  </span>
                                </>
                              ) : null}
                            </div>
                            {sel.Address ? (
                              <div className="text-slate-600">
                                Dirección: {sel.Address}
                              </div>
                            ) : null}
                            {sel.PhoneNumber ? (
                              <div className="text-slate-600">
                                Teléfono: {sel.PhoneNumber}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ) : null
                    }
                  </form.Subscribe>
                </CardContent>
              </Card>

              <Card className="rounded-none border-slate-200 shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base text-[#091540]">
                    Contenido de la solicitud
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form.Field name="Location">
                    {(field) => (
                      <div className="grid gap-2">
                        <Label htmlFor="request-supervision-location">
                          Ubicación del medidor <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="request-supervision-location"
                          autoFocus
                          className="min-h-[120px] resize-none rounded-none"
                          placeholder="Ej. 200m este de la plaza central, casa color verde..."
                          value={field.state.value}
                          onChange={(event) => field.handleChange(event.target.value)}
                        />
                        {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 ? (
                          <p className="text-sm text-red-500">
                            {getFieldErrorMessage(field.state.meta.errors[0])}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </form.Field>

                  <form.Subscribe
                    selector={(state) => ({
                      selectedUser: state.values._selectedUser,
                      nis: state.values.NIS,
                    })}
                  >
                    {({ selectedUser, nis }) => {
                      const nisArray =
                        selectedUser && Array.isArray(selectedUser.Nis)
                          ? selectedUser.Nis
                          : [];

                      if (!selectedUser) {
                        return (
                          <div className="grid gap-2">
                            <Label>NIS</Label>
                            <input
                              type="text"
                              className="h-10 border border-input bg-muted px-3 text-sm text-slate-600"
                              value="Seleccione un abonado primero"
                              readOnly
                              disabled
                            />
                          </div>
                        );
                      }

                      if (!nisArray.length) {
                        return (
                          <form.Field name="NIS">
                            {(field) => (
                              <div className="grid gap-2">
                                <Label>NIS</Label>
                                <input
                                  type="text"
                                  className="h-10 border border-input bg-muted px-3 text-sm text-slate-600"
                                  value="Este abonado no tiene NIS registrado"
                                  readOnly
                                  disabled
                                />
                                {field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 ? (
                                  <p className="text-sm text-red-500">
                                    {getFieldErrorMessage(field.state.meta.errors[0])}
                                  </p>
                                ) : null}
                              </div>
                            )}
                          </form.Field>
                        );
                      }

                      if (nisArray.length === 1) {
                        return (
                          <form.Field name="NIS">
                            {(field) => (
                              <div className="grid gap-2">
                                <Label>NIS</Label>
                                <input
                                  type="text"
                                  className="h-10 border border-input bg-muted px-3 text-sm text-slate-600"
                                  value={String(nisArray[0])}
                                  readOnly
                                  disabled
                                />
                                {field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 ? (
                                  <p className="text-sm text-red-500">
                                    {getFieldErrorMessage(field.state.meta.errors[0])}
                                  </p>
                                ) : null}
                              </div>
                            )}
                          </form.Field>
                        );
                      }

                      return (
                        <form.Field name="NIS">
                          {(field) => (
                            <div className="grid gap-2">
                              <Label htmlFor="request-supervision-meter-nis-select">
                                Seleccione NIS <span className="text-red-500">*</span>
                              </Label>
                              <select
                                id="request-supervision-meter-nis-select"
                                className="h-10 border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-ring"
                                value={nis || ""}
                                onChange={(event) =>
                                  field.handleChange(Number(event.target.value) || 0)
                                }
                              >
                                <option value="">Seleccione una opción</option>
                                {nisArray.map((n) => (
                                  <option key={n} value={n}>
                                    {n}
                                  </option>
                                ))}
                              </select>
                              {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 ? (
                                <p className="text-sm text-red-500">
                                  {getFieldErrorMessage(field.state.meta.errors[0])}
                                </p>
                              ) : null}
                            </div>
                          )}
                        </form.Field>
                      );
                    }}
                  </form.Subscribe>

                  <form.Field name="Justification">
                    {(field) => (
                      <div className="grid gap-2">
                        <Label htmlFor="request-supervision-justification">
                          Justificación <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="request-supervision-justification"
                          className="min-h-[180px] resize-none rounded-none"
                          placeholder="Describa el motivo por el cual solicita la supervisión del medidor."
                          value={field.state.value}
                          onChange={(event) => field.handleChange(event.target.value)}
                        />
                        {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 ? (
                          <p className="text-sm text-red-500">
                            {getFieldErrorMessage(field.state.meta.errors[0])}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </form.Field>
                </CardContent>
              </Card>
            </form>
          </div>

          <DialogFooter className="border-t border-slate-200 px-8 py-5">
            <Button
              type="button"
              variant="ghost"
              className="rounded-none"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="button"
                  className="rounded-none bg-[#091540] text-white hover:bg-[#1789FC]"
                  disabled={!canSubmit || isSubmitting || createMutation.isPending}
                  onClick={() => form.handleSubmit()}
                >
                  {isSubmitting || createMutation.isPending
                    ? "Creando solicitud..."
                    : "Crear Solicitud"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CreateReqSupervisionAdminView({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const createMutation = useCreateReqSupervisionMeter();

  const form = useForm({
    defaultValues: {
      UserId: 0,
      Location: "",
      NIS: 0,
      Justification: "",
      _selectedUser: null as AbonadoSearch | null,
    },
    validators: {
      onChange: CreateSupervisionMeterRequestSchema,
      onSubmit: CreateSupervisionMeterRequestSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await createMutation.mutateAsync({
          UserId: value.UserId,
          Location: value.Location.trim(),
          NIS: Number(value.NIS),
          Justification: value.Justification.trim(),
        });

        toast.success("Solicitud creada correctamente");
        formApi.reset();
        onSuccess?.();
      } catch (error) {
        console.error("Error al crear la solicitud de supervisión de medidor", error);
        toast.error("No se pudo crear la solicitud.");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <Card className="rounded-none border-slate-200 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-[#091540]">
            Datos del abonado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form.Field name="UserId">
            {(field) => (
              <UserTypeahead
                value={field.state.value}
                onChange={(userId, picked) => {
                  field.handleChange(userId);
                  form.setFieldValue("_selectedUser", picked ?? null);
                  if (picked && Array.isArray(picked.Nis)) {
                    if (picked.Nis.length === 1) {
                      form.setFieldValue("NIS", Number(picked.Nis[0]) || 0);
                    } else {
                      form.setFieldValue("NIS", 0);
                    }
                  } else {
                    form.setFieldValue("NIS", 0);
                  }
                }}
              />
            )}
          </form.Field>

          <form.Field name="UserId">
            {(field) =>
              field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                <p className="text-sm text-red-500">
                  {getFieldErrorMessage(field.state.meta.errors[0])}
                </p>
              ) : null
            }
          </form.Field>

          <form.Subscribe selector={(state) => state.values._selectedUser}>
            {(sel) =>
              sel ? (
                <div className="flex items-start gap-3 border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center bg-[#091540]/10 text-[#091540]">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium text-slate-900">
                      {sel.FullName}
                    </div>
                    <div className="text-slate-600">
                      Cédula: <span className="font-mono">{sel.IDcard ?? "—"}</span>
                      {Array.isArray(sel.Nis) && sel.Nis.length ? (
                        <>
                          {" "}
                          • NIS: <span className="font-mono">{sel.Nis.join(", ")}</span>
                        </>
                      ) : null}
                    </div>
                    {sel.Address ? (
                      <div className="text-slate-600">Dirección: {sel.Address}</div>
                    ) : null}
                    {sel.PhoneNumber ? (
                      <div className="text-slate-600">Teléfono: {sel.PhoneNumber}</div>
                    ) : null}
                  </div>
                </div>
              ) : null
            }
          </form.Subscribe>
        </CardContent>
      </Card>

      <Card className="rounded-none border-slate-200 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-[#091540]">
            Contenido de la solicitud
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form.Field name="Location">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="request-supervision-admin-location">
                  Ubicación del medidor <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="request-supervision-admin-location"
                  autoFocus
                  className="min-h-[120px] resize-none rounded-none"
                  placeholder="Ej. 200m este de la plaza central, casa color verde..."
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-red-500">
                    {getFieldErrorMessage(field.state.meta.errors[0])}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => ({
              selectedUser: state.values._selectedUser,
              nis: state.values.NIS,
            })}
          >
            {({ selectedUser, nis }) => {
              const nisArray =
                selectedUser && Array.isArray(selectedUser.Nis)
                  ? selectedUser.Nis
                  : [];

              if (!selectedUser) {
                return (
                  <div className="grid gap-2">
                    <Label>NIS</Label>
                    <input
                      type="text"
                      className="h-10 border border-input bg-muted px-3 text-sm text-slate-600"
                      value="Seleccione un abonado primero"
                      readOnly
                      disabled
                    />
                  </div>
                );
              }

              if (!nisArray.length) {
                return (
                  <form.Field name="NIS">
                    {(field) => (
                      <div className="grid gap-2">
                        <Label>NIS</Label>
                        <input
                          type="text"
                          className="h-10 border border-input bg-muted px-3 text-sm text-slate-600"
                          value="Este abonado no tiene NIS registrado"
                          readOnly
                          disabled
                        />
                        {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 ? (
                          <p className="text-sm text-red-500">
                            {getFieldErrorMessage(field.state.meta.errors[0])}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </form.Field>
                );
              }

              if (nisArray.length === 1) {
                return (
                  <form.Field name="NIS">
                    {(field) => (
                      <div className="grid gap-2">
                        <Label>NIS</Label>
                        <input
                          type="text"
                          className="h-10 border border-input bg-muted px-3 text-sm text-slate-600"
                          value={String(nisArray[0])}
                          readOnly
                          disabled
                        />
                        {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 ? (
                          <p className="text-sm text-red-500">
                            {getFieldErrorMessage(field.state.meta.errors[0])}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </form.Field>
                );
              }

              return (
                <form.Field name="NIS">
                  {(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="request-supervision-admin-nis-select">
                        Seleccione NIS <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="request-supervision-admin-nis-select"
                        className="h-10 border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-ring"
                        value={nis || ""}
                        onChange={(event) =>
                          field.handleChange(Number(event.target.value) || 0)
                        }
                      >
                        <option value="">Seleccione una opción</option>
                        {nisArray.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 ? (
                        <p className="text-sm text-red-500">
                          {getFieldErrorMessage(field.state.meta.errors[0])}
                        </p>
                      ) : null}
                    </div>
                  )}
                </form.Field>
              );
            }}
          </form.Subscribe>

          <form.Field name="Justification">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="request-supervision-admin-justification">
                  Justificación <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="request-supervision-admin-justification"
                  className="min-h-[180px] resize-none rounded-none"
                  placeholder="Describa el motivo por el cual solicita la supervisión del medidor."
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-red-500">
                    {getFieldErrorMessage(field.state.meta.errors[0])}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <div className="flex justify-end border-t border-slate-200 pt-4">
            <Button
              type="submit"
              className="rounded-none bg-[#091540] text-white hover:bg-[#1789FC]"
              disabled={!canSubmit || isSubmitting || createMutation.isPending}
            >
              {isSubmitting || createMutation.isPending
                ? "Creando solicitud..."
                : "Crear Solicitud"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
