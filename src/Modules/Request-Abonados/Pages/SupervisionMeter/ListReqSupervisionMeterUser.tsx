import { useMemo, useState } from "react";
import { useGetAllRequestStates } from "../../../Requests/StateRequest/Hooks/RequestStateHook";
import { useGetMyReqSupervisionMeterPaginated } from "../../Hooks/Supervision-Meter/SupervionMeterHooks";
import type { ReqSupervisionMeter } from "../../../Requests/RequestSupervisionMeter/Models/ReqSupervisionMeter";
import ReqSupervisionMeterUserHeaderBar from "../../Components/Supervision-Meter/ReqSupervisionMeterUserHeaderBar";
import ReqSupervisionMeterUserCards from "../../Components/Supervision-Meter/ReqSupervisionMeterUserCards";
import type { PaginationMeta } from "../../../../assets/Dtos/PaginationCategory";

type LegacyMeta = {
  page?: number;
  limit?: number;
  total?: number;
  pageCount?: number;
};

export default function ListReqSupervisionMeterUser() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [stateRequestId, setStateRequestId] = useState<number | undefined>(undefined);

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    setQ(txt.trim());
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

  // Estados disponibles (para el dropdown)
  const { requestStates = [], isPending: requestStatesLoading } = useGetAllRequestStates();

  // Backend paginado (mis solicitudes) con filtros
  const { data, isLoading, error } = useGetMyReqSupervisionMeterPaginated({
    page,
    limit,
    StateRequestId: stateRequestId,
    q,
  });

  const rows: ReqSupervisionMeter[] = data?.data ?? [];
  const rawMeta = data?.meta as (PaginationMeta & LegacyMeta) | undefined;
  const meta = {
    total: rawMeta?.totalItems ?? rawMeta?.total ?? 0,
    page: rawMeta?.currentPage ?? rawMeta?.page ?? page,
    limit: rawMeta?.itemsPerPage ?? rawMeta?.limit ?? limit,
    pageCount:
      rawMeta?.totalPages ??
      rawMeta?.pageCount ??
      Math.ceil((rawMeta?.totalItems ?? rawMeta?.total ?? 0) / limit),
    hasNextPage: rawMeta?.hasNextPage ?? false,
    hasPrevPage: rawMeta?.hasPrevPage ?? false
  };

  // Filtrado cliente solo para el buscador
  const filteredRows = useMemo(() => {
    const txt = search.trim().toLowerCase();
    if (!txt) return rows;
    return rows.filter((r) => {
      const inJust = String(r.Justification ?? "").toLowerCase().includes(txt);
      const inDate = String(r.Date ?? "").toLowerCase().includes(txt);
      const inState = String(r.StateRequest?.Name ?? "").toLowerCase().includes(txt);
      return inJust || inDate || inState;
    });
  }, [rows, search]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <ReqSupervisionMeterUserHeaderBar
          limit={meta.limit}
          total={meta.total}
          search={search}
          requestStateId={stateRequestId}
          states={requestStates}
          statesLoading={requestStatesLoading}
          onStateRequestChange={handleStateRequestChange}
          onLimitChange={(l: number) => {
            setLimit(l);
            setPage(1);
          }}
          onSearchChange={handleSearchChange}
          onCleanFilters={handleCleanFilters}
        />
      </div>

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
          <ReqSupervisionMeterUserCards
            data={filteredRows}
            total={meta.total}
            page={meta.page}
            pageCount={meta.pageCount}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
