import { useMemo, useState } from "react";
import type { PaginationMeta } from "../../../../assets/Dtos/PaginationCategory";
import { useGetAllRequestStates } from "../../../Requests/StateRequest/Hooks/RequestStateHook";
import { useGetMyReqChangeNameMeterPaginated } from "../../Hooks/ChangeNameMeter/ChangeNameMeter";
import type { ReqChangeNameMeter } from "../../../Requests/RequestChangeNameMeter/Models/RequestChangeNameMeter";
import ReqChangeNameMeterUserHeaderBar from "../../Components/ChangeNameMeter/ReqChangeNameMeterUserHeaderBar";
import ReqChangeNameMeterUserCards from "../../Components/ChangeNameMeter/ReqChangeNameMeterUserCards";

type LegacyMeta = {
  page?: number;
  limit?: number;
  total?: number;
  pageCount?: number;
};

export default function ListReqChangeNameMeterUser() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [stateRequestId, setStateRequestId] = useState<number | undefined>(undefined);

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    setPage(1);
  };

  const handleStateRequestChange = (id?: number) => {
    setStateRequestId(id);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setStateRequestId(undefined);
    setPage(1);
  };

  const { requestStates = [], isPending: requestStatesLoading } = useGetAllRequestStates();

  const { data, isLoading, error } = useGetMyReqChangeNameMeterPaginated({
    page,
    limit,
    StateRequestId: stateRequestId,
  });

  const rows = useMemo<ReqChangeNameMeter[]>(() => data?.data ?? [], [data?.data]);
  const rawMeta = data?.meta as (PaginationMeta & LegacyMeta) | undefined;
  const meta = {
    total: rawMeta?.total ?? rawMeta?.total ?? 0,
    page: rawMeta?.page ?? rawMeta?.page ?? page,
    limit: rawMeta?.limit ?? rawMeta?.limit ?? limit,
    pageCount:
      rawMeta?.page ??
      rawMeta?.pageCount ??
      Math.ceil((rawMeta?.total ?? rawMeta?.total ?? 0) / limit),
    hasNextPage: rawMeta?.hasNextPage ?? false,
    hasPrevPage: rawMeta?.hasPrevPage ?? false,
  };

  const filteredRows = useMemo(() => {
    const txt = search.trim().toLowerCase();
    if (!txt) return rows;

    return rows.filter((r) => {
      const inJustification = String(r.Justification ?? "").toLowerCase().includes(txt);
      const inDate = String(r.Date ?? "").toLowerCase().includes(txt);
      const inState = String(r.StateRequest?.Name ?? "").toLowerCase().includes(txt);
      return inJustification || inDate || inState;
    });
  }, [rows, search]);

  return (
    <div className="flex flex-col gap-6">
      <ReqChangeNameMeterUserHeaderBar
        limit={meta.limit}
        total={meta.total}
        search={search}
        requestStateId={stateRequestId}
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
          <ReqChangeNameMeterUserCards
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
