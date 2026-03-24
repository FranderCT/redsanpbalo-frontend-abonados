import { useMemo, useState } from "react";
import { useGetAllRequestStates } from "../../StateRequest/Hooks/RequestStateHook";
import { useSearchReqSupervisionMeter } from "../Hooks/ReqSupervisionMeterHooks";
import type { ReqSupervisionMeter } from "../Models/ReqSupervisionMeter";
import ReqSupervisionMeterHeaderBar from "../Components/PaginationReqSupervisionMeter/ReqSupervisionMeterHeaderBar";
import ReqSupervisionMeterCards from "../Components/ReqSupervisionMeterCards/ReqSupervisionMeterCards";
import { CreateReqSupervisionAdminView } from "../Modals/AdminRequestSupervisionMeter";
import type { PaginationMeta } from "../../../../assets/Dtos/PaginationCategory";

type LegacyMeta = {
  page?: number;
  limit?: number;
  total?: number;
  pageCount?: number;
};

export default function ListReqSupervisionMeter() {
  const [viewMode, setViewMode] = useState<"create" | "list">("list");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [UserName, setUserName] = useState<string | undefined>(undefined);
  const [Justification, setJustification] = useState<string | undefined>(undefined);
  const [StateRequestId, setStateRequestId] = useState<number | undefined>(
    undefined,
  );

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    const trimmed = txt.trim();
    setUserName(trimmed ? trimmed : undefined);
    setJustification(trimmed ? trimmed : undefined);
    setPage(1);
  };

  const handleStateRequestChange = (id?: number) => {
    setStateRequestId(id);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setUserName(undefined);
    setJustification(undefined);
    setStateRequestId(undefined);
    setPage(1);
  };

  const { requestStates = [], isPending: requestStatesLoading } =
    useGetAllRequestStates();

  const params = useMemo(
    () => ({
      page,
      limit,
      Justification,
      UserName,
      StateRequestId,
    }),
    [page, limit, Justification, UserName, StateRequestId],
  );

  const { data, isLoading, error } = useSearchReqSupervisionMeter(params);
  const rows: ReqSupervisionMeter[] = data?.data ?? [];
  const filteredRows = useMemo(() => {
    const txt = search.trim().toLowerCase();
    if (!txt) return rows;

    return rows.filter((row) => {
      const applicant = `${row.User?.Name ?? ""} ${row.User?.Surname1 ?? ""} ${row.User?.Surname2 ?? ""}`
        .toLowerCase()
        .trim();
      const identity = `${row.User?.IDcard ?? ""} ${row.User?.Email ?? ""}`.toLowerCase();
      const justification = String(row.Justification ?? "").toLowerCase();
      const location = String(row.Location ?? "").toLowerCase();
      return (
        applicant.includes(txt) ||
        identity.includes(txt) ||
        justification.includes(txt) ||
        location.includes(txt)
      );
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
              {viewMode === "create"
                ? "Nueva solicitud de supervisión de medidor"
                : "Solicitudes de supervisión de medidor"}
            </h1>
            <p className="text-sm text-[#091540]/70">
              {viewMode === "create"
                ? "Registre una nueva solicitud de supervisión de medidor."
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
          <CreateReqSupervisionAdminView onSuccess={() => setViewMode("list")} />
        </div>
      ) : (
        <>
          <ReqSupervisionMeterHeaderBar
            limit={meta.limit}
            total={meta.total}
            search={search}
            requestStateId={StateRequestId}
            states={requestStates}
            statesLoading={requestStatesLoading}
            onStateRequestChange={handleStateRequestChange}
            onLimitChange={(nextLimit) => {
              setLimit(nextLimit);
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
              <ReqSupervisionMeterCards
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
