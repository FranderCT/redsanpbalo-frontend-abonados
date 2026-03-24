import { useForm } from "@tanstack/react-form";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Upload, UserRound } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import type { AbonadoSearch } from "../../GeneralGetUser/Model";
import { useSearchAbonados } from "../../GeneralGetUser/GenralHook";
import { useGetAllRequestStates } from "../../StateRequest/Hooks/RequestStateHook";
import { useSearchRequestAssociated } from "../Hooks/ReqAssociatedHooks";
import type { ReqAssociated } from "../Models/RequestAssociated";
import type { PaginationMeta } from "../../../../assets/Dtos/PaginationCategory";
import ReqAssociatedHeaderBar from "../Components/PaginationReqAssociated/ReqAssociatedHeaderBar";
import ReqAssociatedCards from "../Components/ReqAssociatedCards/ReqAssociatedCards";
import { Textarea } from "@/Components/ui/textarea";
import { useCreateAssociatedRequest } from "../../../Request-Abonados/Hooks/Associated/AssociatedRqHooks";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { UploadAssociatedFiles } from "../../../Upload-files/Services/ProjectFileServices";
import { CreateAssociatedRequestSchema } from "../schemas/CreateAssociatedRequestSchema";
import { getAssociatedRequestPrimaryNis } from "../utils/associatedRequestForm";

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

type LegacyMeta = {
  page?: number;
  limit?: number;
  total?: number;
  pageCount?: number;
};

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

function CreateAssociatedRqAdminView({ onSuccess }: { onSuccess: () => void }) {
  const createMutation = useCreateAssociatedRequest();
  const { UserProfile } = useGetUserProfile();
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
        onSuccess();
      } catch (error) {
        console.error(error);
        toast.error("Error al crear la solicitud. Intente nuevamente.");
      } finally {
        setIsUploading(false);
        setUploadProgress("");
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

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <div className="flex justify-end border-t border-slate-200 pt-4">
            <Button type="submit" className="rounded-none bg-[#091540] text-white hover:bg-[#1789FC]" disabled={!canSubmit || isSubmitting || isUploading}>
              {(isSubmitting || isUploading) ? uploadProgress || "Procesando..." : "Crear Solicitud"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default function ListReqAssociated() {
  const [viewMode, setViewMode] = useState<"create" | "list">("list");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState<string | undefined>(undefined);
  const [StateRequestId, setStateRequestId] = useState<number | undefined>(undefined);

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    const trimmed = txt.trim();
    setQ(trimmed ? trimmed : undefined);
    setPage(1);
  };

  const handleStateRequestChange = (id?: number) => {
    setStateRequestId(id);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setQ(undefined);
    setStateRequestId(undefined);
    setPage(1);
  };

  const { requestStates = [], isPending: requestStatesLoading } = useGetAllRequestStates();

  const params = useMemo(
    () => ({
      page,
      limit,
      q,
      StateRequestId,
    }),
    [page, limit, q, StateRequestId]
  );

  useEffect(() => {
    console.log("[Filtros UI] Solicitudes asociadas admin", params);
  }, [params]);

  const { data, isLoading, error } = useSearchRequestAssociated(params);
  const rows = useMemo<ReqAssociated[]>(() => data?.data ?? [], [data?.data]);
  const filteredRows = useMemo(() => {
    const txt = search.trim().toLowerCase();
    if (!txt) return rows;

    return rows.filter((r) => {
      const inJustification = String(r.Justification ?? "").toLowerCase().includes(txt);
      const fullName = `${r.User?.Name ?? ""} ${r.User?.Surname1 ?? ""} ${r.User?.Surname2 ?? ""}`
        .toLowerCase()
        .trim();
      const inUser = fullName.includes(txt);
      return inJustification || inUser;
    });
  }, [rows, search]);

  const rawMeta = data?.meta as (PaginationMeta & LegacyMeta) | undefined;
  const meta = {
    total: rawMeta?.totalItems ?? rawMeta?.total ?? 0,
    page: rawMeta?.currentPage ?? rawMeta?.page ?? 1,
    limit: rawMeta?.itemsPerPage ?? rawMeta?.limit ?? limit,
    pageCount: rawMeta?.totalPages ?? rawMeta?.pageCount ?? 1,
    hasNextPage: rawMeta?.hasNextPage ?? false,
    hasPrevPage: rawMeta?.hasPrevPage ?? false,
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <section className="border border-slate-200 bg-white text-[#091540] shadow-sm">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {viewMode === "create" ? "Nueva solicitud de asociación" : "Solicitudes de asociación"}
            </h1>
            <p className="text-sm text-[#091540]/70">
              {viewMode === "create"
                ? "Registre la solicitud y adjunte la evidencia necesaria si corresponde."
                : "Revise el listado, filtre resultados y gestione el estado de cada solicitud."}
            </p>
          </div>

          <div className="inline-flex items-center self-start border border-slate-200 bg-slate-100 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("create")}
              aria-pressed={viewMode === "create"}
              className={`h-10 px-4 text-sm font-medium transition-all ${viewMode === "create" ? "bg-[#091540] text-white shadow" : "bg-transparent text-[#091540] hover:bg-white"}`}
            >
              Nueva solicitud
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              className={`h-10 px-4 text-sm font-medium transition-all ${viewMode === "list" ? "bg-[#091540] text-white shadow" : "bg-transparent text-[#091540] hover:bg-white"}`}
            >
              Ver solicitudes
            </button>
          </div>
        </div>
      </section>

      {viewMode === "create" ? (
        <div className="space-y-6">
          <CreateAssociatedRqAdminView onSuccess={() => setViewMode("list")} />
        </div>
      ) : (
        <>
          <ReqAssociatedHeaderBar
            limit={meta.limit}
            total={meta.total}
            search={search}
            requestStateId={StateRequestId}
            states={requestStates}
            statesLoading={requestStatesLoading}
            onStateRequestChange={handleStateRequestChange}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
            onSearchChange={handleSearchChange}
            onCleanFilters={handleCleanFilters}
          />

          <div className="flex flex-col">
            {isLoading ? (
              <div className="border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                Cargando solicitudes…
              </div>
            ) : error ? (
              <div className="border border-red-200 bg-red-50 p-8 text-center text-red-600">
                Ocurrió un error al cargar las solicitudes.
              </div>
            ) : (
              <ReqAssociatedCards
                data={filteredRows}
                total={meta.total}
                page={meta.page}
                pageCount={meta.pageCount}
                onPageChange={setPage}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
