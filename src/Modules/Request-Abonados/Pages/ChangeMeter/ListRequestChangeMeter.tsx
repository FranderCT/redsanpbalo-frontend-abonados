import { useMemo, useState } from "react";
import type { PaginationMeta } from "../../../../assets/Dtos/PaginationCategory";
import { useGetAllRequestStates } from "../../../Requests/StateRequest/Hooks/RequestStateHook";
import type { ReqChangeMeter } from "../../../Requests/RequestChangeMeterr/Models/RequestChangeMeter";
import ReqChangeMeterUserHeaderBar from "../../Components/Change-Meter/ReqChangeMeterUserHeaderBar";
import ReqChangeMeterUserCards from "../../Components/Change-Meter/ReqChangeMeterUserCards";
import { useGetMyReqChangeMeterPaginated } from "../../Hooks/Change-Meter/ChangeMeterHooks";

type LegacyMeta = {
  page?: number;
  limit?: number;
  total?: number;
  pageCount?: number;
};

export default function ListReqChangeMeterUser() {
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

  const { requestStates = [], isPending: requestStatesLoading } = useGetAllRequestStates();
  const { data, isLoading, error } = useGetMyReqChangeMeterPaginated({
    page,
    limit,
    StateRequestId: stateRequestId,
    q,
  });

  const rows = useMemo<ReqChangeMeter[]>(() => data?.data ?? [], [data?.data]);
  const rawMeta = data?.meta as (PaginationMeta & LegacyMeta) | undefined;
  const meta = {
    total: rawMeta?.totalItems ?? rawMeta?.total ?? 0,
    page: rawMeta?.currentPage ?? rawMeta?.page ?? page,
    limit: rawMeta?.itemsPerPage ?? rawMeta?.limit ?? limit,
    pageCount:
      rawMeta?.totalPages ??
      rawMeta?.pageCount ??
      Math.ceil((rawMeta?.totalItems ?? rawMeta?.total ?? 0) / limit),
  };

  return (
    <div className="flex flex-col gap-6">
      <ReqChangeMeterUserHeaderBar
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
          <ReqChangeMeterUserCards
            data={rows}
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
