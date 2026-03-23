import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Upload, UserRound } from "lucide-react";
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
import { Separator } from "@/Components/ui/separator";
import { Textarea } from "@/Components/ui/textarea";
import type { AbonadoSearch } from "../../../GeneralGetUser/Model";
import { useSearchAbonados } from "../../../GeneralGetUser/GenralHook";
import { useCreateAssociatedRequest } from "../../../../Request-Abonados/Hooks/Associated/AssociatedRqHooks";
import { useGetUserProfile } from "../../../../Users/Hooks/UsersHooks";
import { UploadAssociatedFiles } from "../../../../Upload-files/Services/ProjectFileServices";
import { CreateAssociatedRequestSchema } from "../../schemas/CreateAssociatedRequestSchema";
import { getAssociatedRequestPrimaryNis } from "../../utils/associatedRequestForm";

type RetryableError = {
  response?: {
    status?: number;
    headers?: Record<string, string | undefined>;
  };
};

const getFieldErrorMessage = (error: unknown) =>
  typeof error === "object" && error !== null && "message" in error
    ? String((error as { message?: string }).message ?? "Valor inválido")
    : String(error);

const uploadWithRetry = async (
  uploadFn: () => Promise<unknown>,
  maxRetries = 3,
  baseDelay = 1000,
): Promise<unknown> => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await uploadFn();
    } catch (error) {
      const requestError = error as RetryableError;
      attempt++;
      if (requestError.response?.status === 429) {
        const retryAfter = requestError.response.headers?.["retry-after"];
        const delayMs = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.min(baseDelay * Math.pow(2, attempt), 10000);
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, Math.max(delayMs, 500)));
          continue;
        }
      }
      throw error;
    }
  }
};

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
      <Label className="mb-2 block">Abonado (buscar por cédula/NIS) <span className="text-red-500">*</span></Label>
      <div className="flex items-center gap-2 border border-input bg-background px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
        <Input
          type="text"
          value={selectedUser ? `${selectedUser.IDcard ?? (Array.isArray(selectedUser.Nis) && selectedUser.Nis.length ? selectedUser.Nis.join(", ") : "")}` : input}
          onChange={(e) => {
            setInput(e.target.value);
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
            <div className="p-3 text-sm text-slate-500">{input.trim() ? "Sin resultados" : "Escriba para buscar"}</div>
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

export default function CreateAssociatedRqModalAdmin() {
  const createMutation = useCreateAssociatedRequest();
  const { UserProfile } = useGetUserProfile();
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const form = useForm({
    defaultValues: {
      NIS: 0,
      Justification: "",
      evidenciaBoletaFirmada: [] as File[],
      UserId: 0,
      _selectedUser: null as AbonadoSearch | null,
    },
    validators: {
      onChange: CreateAssociatedRequestSchema,
      onSubmit: CreateAssociatedRequestSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const derivedNis = getAssociatedRequestPrimaryNis(value._selectedUser);
        const requestPayload = {
          NIS: derivedNis,
          Justification: value.Justification.trim(),
          UserId: Number(value.UserId) || 0,
        };

        const requestResult = await createMutation.mutateAsync(requestPayload);

        const requestId = requestResult?.Id;
        if (!requestId) throw new Error("No se obtuvo el ID de la solicitud creada.");

        if (value.evidenciaBoletaFirmada.length > 0) {
          setIsUploading(true);
          setUploadProgress("Subiendo evidencia...");
          try {
            await uploadWithRetry(() =>
              UploadAssociatedFiles(
                requestId,
                value.evidenciaBoletaFirmada,
                "Evidencia-Boleta-Firmada",
                UserProfile?.Id,
              ),
            );
            toast.success("Solicitud creada y evidencia subida exitosamente");
          } catch (uploadError) {
            console.error(uploadError);
            toast.error("Solicitud creada, pero ocurrió un error al subir la evidencia.");
          }
        } else {
          toast.success("Solicitud de asociación creada exitosamente");
        }

        formApi.reset();
        setUploadProgress("");
        setOpen(false);
      } catch (error) {
        console.error(error);
        toast.error("Error al crear la solicitud. Intente nuevamente.");
      } finally {
        setIsUploading(false);
        setUploadProgress("");
      }
    },
  });

  const handleClose = () => {
    toast.warning("Solicitud cancelada", { position: "top-right", autoClose: 3000 });
    form.reset();
    setIsUploading(false);
    setUploadProgress("");
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} className="rounded-none bg-[#091540] text-white hover:bg-[#1789FC]">
        + Solicitar Asociación
      </Button>

      <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) handleClose(); }}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden rounded-none border-slate-200 p-0">
          <DialogHeader className="border-b border-slate-200 px-8 py-6">
            <DialogTitle className="text-2xl text-[#091540]">Solicitud de Asociación</DialogTitle>
            <DialogDescription>
              Busque el abonado y complete la información requerida. El NIS se toma automáticamente.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex max-h-[calc(90vh-140px)] flex-col overflow-hidden"
          >
            <div className="flex-1 space-y-6 overflow-y-auto px-8 py-6">
              <Card className="rounded-none border-slate-200 shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base text-[#091540]">Datos del abonado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form.Field name="UserId">
                    {(field) => (
                      <UserTypeahead
                        value={field.state.value}
                        onChange={(userId, picked) => {
                          form.setFieldValue("_selectedUser", picked ?? null);
                          form.setFieldValue("NIS", getAssociatedRequestPrimaryNis(picked));
                          field.handleChange(userId);
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

                  <form.Subscribe selector={(s) => s.values._selectedUser}>
                    {(sel) =>
                      sel ? (
                        <div className="flex items-start gap-3 border border-slate-200 bg-slate-50 p-4">
                          <div className="flex h-10 w-10 items-center justify-center bg-[#091540]/10 text-[#091540]">
                            <UserRound className="h-5 w-5" />
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="font-medium text-slate-900">{sel.FullName}</div>
                            <div className="text-slate-600">
                              Cédula: <span className="font-mono">{sel.IDcard ?? "—"}</span>
                              {Array.isArray(sel.Nis) && sel.Nis.length ? <> • NIS: <span className="font-mono">{sel.Nis.join(", ")}</span></> : null}
                            </div>
                            {sel.Address ? <div className="text-slate-600">Dirección: {sel.Address}</div> : null}
                            {sel.PhoneNumber ? <div className="text-slate-600">Teléfono: {sel.PhoneNumber}</div> : null}
                          </div>
                        </div>
                      ) : null
                    }
                  </form.Subscribe>

                </CardContent>
              </Card>

              <Card className="rounded-none border-slate-200 shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base text-[#091540]">Contenido de la solicitud</CardTitle>
                </CardHeader>
                <CardContent>
                  <form.Field name="Justification">
                    {(field) => (
                      <div className="grid gap-2">
                        <Label htmlFor="request-associated-justification">
                          Justificación de la solicitud de asociado <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="request-associated-justification"
                          autoFocus
                          className="min-h-[180px] rounded-none resize-none"
                          placeholder="Describa el motivo de su solicitud para ser asociado"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                          <p className="text-sm text-red-500">{getFieldErrorMessage(field.state.meta.errors[0])}</p>
                        ) : null}
                        <p className="text-xs text-slate-500">Proporcione una justificación clara y detallada para su solicitud.</p>
                      </div>
                    )}
                  </form.Field>
                </CardContent>
              </Card>

              <Card className="rounded-none border-slate-200 shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base text-[#091540]">Documentos de respaldo</CardTitle>
                </CardHeader>
                <CardContent>
                  <form.Field name="evidenciaBoletaFirmada">
                    {(field) => (
                      <div className="space-y-4">
                        <div>
                          <Label className="mb-2 block">Evidencia de boleta firmada <span className="text-xs text-slate-500">(Opcional)</span></Label>
                          <label className="block cursor-pointer border-2 border-dashed border-slate-300 p-8 text-center transition-all hover:border-[#1789FC] hover:bg-sky-50/30">
                            <div className="flex flex-col items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center bg-slate-100 text-slate-500">
                                <Upload className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700">Seleccionar archivos</p>
                                <p className="mt-1 text-xs text-slate-500">PDF, DOC, JPG, PNG (Máx. 10MB c/u)</p>
                              </div>
                            </div>
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                              onChange={(e) => {
                                if (!e.target.files) return;
                                const validFiles = Array.from(e.target.files).filter((file) => {
                                  if (file.size > 10 * 1024 * 1024) {
                                    toast.error(`El archivo "${file.name}" excede el tamaño máximo de 10MB`);
                                    return false;
                                  }
                                  return true;
                                });
                                field.handleChange(validFiles);
                              }}
                            />
                          </label>
                        </div>

                        {field.state.value.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-700">Archivos seleccionados</p>
                            {field.state.value.map((file: File, index: number) => (
                              <div key={`${file.name}-${index}`} className="flex items-center justify-between border border-slate-200 bg-slate-50 p-3">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-none text-red-600 hover:text-red-700"
                                  onClick={() => field.handleChange(field.state.value.filter((_: File, i: number) => i !== index))}
                                >
                                  Quitar
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </form.Field>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <DialogFooter className="px-8 py-5">
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <>
                    <Button type="button" variant="ghost" className="rounded-none" onClick={handleClose} disabled={isSubmitting || isUploading}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="rounded-none bg-[#091540] text-white hover:bg-[#1789FC]" disabled={!canSubmit || isSubmitting || isUploading}>
                      {(isSubmitting || isUploading) ? uploadProgress || "Procesando..." : "Crear Solicitud"}
                    </Button>
                  </>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
