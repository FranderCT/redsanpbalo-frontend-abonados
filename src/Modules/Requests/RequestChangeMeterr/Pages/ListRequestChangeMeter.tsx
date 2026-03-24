import { useEffect, useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { UserRound } from "lucide-react";
import type { PaginationMeta } from "../../../../assets/Dtos/PaginationCategory";
import type { AbonadoSearch } from "../../GeneralGetUser/Model";
import { useSearchAbonados } from "../../GeneralGetUser/GenralHook";
import { useGetAllRequestStates } from "../../StateRequest/Hooks/RequestStateHook";
import type { ReqChangeMeter } from "../Models/RequestChangeMeter";
import { useSearchReqChangeMeter } from "../Hooks/RequestChangeMeter";
import ReqChangeMeterHeaderBar from "../Components/PaginationRequestChangeMeter/RequestChangeMeterHeaderBar";
import ReqChangeMeterCards from "../Components/RequestChangeMeterCards/ReqChangeMeterCards";
import { useCreateChangeMeterRequest } from "../../../Request-Abonados/Hooks/Change-Meter/ChangeMeterHooks";
import { CreateChangeMeterRequestSchema } from "../schemas/CreateChangeMeterRequestSchema";

type LegacyMeta = {
  page?: number;
  limit?: number;
  total?: number;
  pageCount?: number;
};

const getFieldErrorMessage = (error: unknown) =>
  typeof error === "object" && error !== null && "message" in error
    ? String((error as { message?: string }).message ?? "Valor inválido")
    : String(error);

const useDebouncedValue = (value: string, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

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
  const selectedUser = users.find((user) => user.Id === value);

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
            ? users.map((user) => (
                <button
                  key={user.Id}
                  type="button"
                  onClick={() => {
                    onChange(user.Id, user);
                    setInput(user.IDcard || "");
                    setOpenList(false);
                  }}
                  className="w-full border-b border-slate-100 px-3 py-2 text-left hover:bg-slate-50 last:border-0"
                >
                  <div className="text-sm font-medium text-slate-900">{user.FullName}</div>
                  <div className="text-xs text-slate-500">
                    Cédula: {user.IDcard}
                    {Array.isArray(user.Nis) && user.Nis.length ? ` • NIS: ${user.Nis.join(", ")}` : ""}
                  </div>
                </button>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}

function CreateChangeMeterAdminView({ onSuccess }: { onSuccess: () => void }) {
  const createMutation = useCreateChangeMeterRequest();

  const form = useForm({
    defaultValues: {
      UserId: 0,
      Location: "",
      NIS: 0,
      Justification: "",
      _selectedUser: null as AbonadoSearch | null,
    },
    validators: {
      onChange: CreateChangeMeterRequestSchema,
      onSubmit: CreateChangeMeterRequestSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await createMutation.mutateAsync({
          UserId: Number(value.UserId) || 0,
          Location: value.Location.trim(),
          NIS: Number(value.NIS) || 0,
          Justification: value.Justification.trim(),
        });

        formApi.reset();
        onSuccess();
      } catch (error) {
        console.error("Error al crear la solicitud de cambio de medidor", error);
        toast.error("No se pudo crear la solicitud.");
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
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
                  const nisList = Array.isArray(picked?.Nis) ? picked.Nis : [];
                  const resolvedNis = nisList.length === 1 ? Number(nisList[0]) : 0;
                  form.setFieldValue("_selectedUser", picked ?? null);
                  form.setFieldValue("NIS", resolvedNis);
                  field.handleChange(userId);
                }}
              />
            )}
          </form.Field>

          <form.Field name="UserId">
            {(field) =>
              field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                <p className="text-sm text-red-500">{getFieldErrorMessage(field.state.meta.errors[0])}</p>
              ) : null
            }
          </form.Field>

          <form.Subscribe selector={(state) => state.values._selectedUser}>
            {(selectedUser) =>
              selectedUser ? (
                <div className="flex items-start gap-3 border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center bg-[#091540]/10 text-[#091540]">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium text-slate-900">{selectedUser.FullName}</div>
                    <div className="text-slate-600">
                      Cédula: <span className="font-mono">{selectedUser.IDcard ?? "—"}</span>
                      {Array.isArray(selectedUser.Nis) && selectedUser.Nis.length ? (
                        <>
                          {" "}
                          • NIS: <span className="font-mono">{selectedUser.Nis.join(", ")}</span>
                        </>
                      ) : null}
                    </div>
                    {selectedUser.Address ? <div className="text-slate-600">Dirección: {selectedUser.Address}</div> : null}
                    {selectedUser.PhoneNumber ? <div className="text-slate-600">Teléfono: {selectedUser.PhoneNumber}</div> : null}
                  </div>
                </div>
              ) : null
            }
          </form.Subscribe>

          <form.Subscribe selector={(state) => state.values._selectedUser}>
            {(selectedUser) => {
              const nisList = Array.isArray(selectedUser?.Nis) ? selectedUser.Nis : [];

              return (
                <form.Field name="NIS">
                  {(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="request-change-meter-admin-nis">
                        NIS <span className="text-red-500">*</span>
                      </Label>

                      {nisList.length === 0 ? (
                        <Input
                          id="request-change-meter-admin-nis"
                          value={selectedUser ? "El abonado no tiene NIS registrado" : "Seleccione un abonado"}
                          readOnly
                          disabled
                          className="rounded-none"
                        />
                      ) : nisList.length === 1 ? (
                        <Input
                          id="request-change-meter-admin-nis"
                          value={String(nisList[0])}
                          readOnly
                          disabled
                          className="rounded-none"
                        />
                      ) : (
                        <select
                          id="request-change-meter-admin-nis"
                          className="h-10 border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-ring"
                          value={field.state.value || ""}
                          onChange={(event) => field.handleChange(Number(event.target.value))}
                        >
                          <option value="">Seleccione un NIS</option>
                          {nisList.map((nis) => (
                            <option key={nis} value={nis}>
                              {nis}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                        <p className="text-sm text-red-500">{getFieldErrorMessage(field.state.meta.errors[0])}</p>
                      ) : null}
                    </div>
                  )}
                </form.Field>
              );
            }}
          </form.Subscribe>
        </CardContent>
      </Card>

      <Card className="rounded-none border-slate-200 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-[#091540]">Contenido de la solicitud</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form.Field name="Location">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="request-change-meter-admin-location">
                  Ubicación del medidor <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="request-change-meter-admin-location"
                  className="min-h-[120px] rounded-none resize-none"
                  placeholder="Ej. 200m este de la plaza central, casa color verde..."
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-red-500">{getFieldErrorMessage(field.state.meta.errors[0])}</p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field name="Justification">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="request-change-meter-admin-justification">
                  Justificación <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="request-change-meter-admin-justification"
                  className="min-h-[180px] rounded-none resize-none"
                  placeholder="Describa el motivo por el cual se solicita el cambio de medidor."
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-red-500">{getFieldErrorMessage(field.state.meta.errors[0])}</p>
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
              {isSubmitting || createMutation.isPending ? "Creando solicitud..." : "Crear Solicitud"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default function ListReqChangeMeter() {
  const [viewMode, setViewMode] = useState<"create" | "list">("list");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [StateRequestId, setStateRequestId] = useState<number | undefined>(undefined);

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    const trimmed = txt.trim();
    setQ(trimmed);
    setPage(1);
  };

  const handleStateRequestChange = (id?: number) => {
    setStateRequestId(id);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setQ("");
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
    [page, limit, q, StateRequestId],
  );

  const { data, isLoading, error } = useSearchReqChangeMeter(params);
  const rows = useMemo<ReqChangeMeter[]>(() => data?.data ?? [], [data?.data]);

  const rawMeta = data?.meta as (PaginationMeta & LegacyMeta) | undefined;
  const meta = {
    total: rawMeta?.totalItems ?? rawMeta?.total ?? 0,
    page: rawMeta?.currentPage ?? rawMeta?.page ?? 1,
    limit: rawMeta?.itemsPerPage ?? rawMeta?.limit ?? limit,
    pageCount: rawMeta?.totalPages ?? rawMeta?.pageCount ?? 1,
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <section className="border border-slate-200 bg-white text-[#091540] shadow-sm">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {viewMode === "create" ? "Nueva solicitud de cambio de medidor" : "Solicitudes de cambio de medidor"}
            </h1>
            <p className="text-sm text-[#091540]/70">
              {viewMode === "create"
                ? "Registre una solicitud para un abonado y complete los datos del medidor."
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
        <CreateChangeMeterAdminView onSuccess={() => setViewMode("list")} />
      ) : (
        <>
          <ReqChangeMeterHeaderBar
            limit={meta.limit}
            total={meta.total}
            search={search}
            requestStateId={StateRequestId}
            states={requestStates}
            statesLoading={requestStatesLoading}
            onStateRequestChange={handleStateRequestChange}
            onLimitChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
            onSearchChange={handleSearchChange}
            onCleanFilters={handleCleanFilters}
          />

          <div>
            {isLoading ? (
              <div className="border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                Cargando solicitudes…
              </div>
            ) : error ? (
              <div className="border border-red-200 bg-red-50 p-8 text-center text-red-600">
                Ocurrió un error al cargar las solicitudes.
              </div>
            ) : (
              <ReqChangeMeterCards
                data={rows}
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
