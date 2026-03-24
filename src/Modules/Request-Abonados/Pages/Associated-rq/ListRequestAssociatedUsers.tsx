import { useMemo, useState } from "react";
import type { PaginationMeta } from "../../../../assets/Dtos/PaginationCategory";
import { useGetAllRequestStates } from "../../../Requests/StateRequest/Hooks/RequestStateHook";
import type { ReqAssociated } from "../../../Requests/RequestAssociated/Models/RequestAssociated";
import { useGetMyReqAssociatedPaginated } from "../../Hooks/Associated/AssociatedRqHooks";
import ReqAssociatedUserHeaderBar from "../../Components/Associated-rq/ReqAssociatedUserHeaderBar";
import ReqAssociatedUserCards from "../../Components/Associated-rq/ReqAssociatedUserCards";

type LegacyMeta = {
  page?: number;
  limit?: number;
  total?: number;
  pageCount?: number;
};

export default function ListReqAssociateUser() {
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

  // Estados disponibles (para el dropdown)
  const { requestStates = [], isPending: requestStatesLoading } = useGetAllRequestStates();

  // Backend paginado (mis solicitudes) con filtros
  const { data, isLoading, error } = useGetMyReqAssociatedPaginated({
    page,
    limit,
    StateRequestId: stateRequestId,
    q: search,
  });

  const rows = useMemo<ReqAssociated[]>(() => data?.data ?? [], [data?.data]);
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
    hasPrevPage: rawMeta?.hasPrevPage ?? false,
  };

  // Filtrado cliente solo para el buscador
  const filteredRows = useMemo(() => {
    const txt = search.trim().toLowerCase();
    if (!txt) return rows;
    return rows.filter((r) => {
      const inJust = String(r.Justification ?? "").toLowerCase().includes(txt);
      const inDate = String(r.Date ?? "").toLowerCase().includes(txt);
      const inState = String(r.StateRequest?.Name ?? "").toLowerCase().includes(txt);
      const fullName = `${r.User?.Name ?? ""} ${r.User?.Surname1 ?? ""} ${r.User?.Surname2 ?? ""}`.toLowerCase();
      const inUser = fullName.includes(txt);
      return inJust || inDate || inState || inUser;
    });
  }, [rows, search]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <ReqAssociatedUserHeaderBar
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
          <ReqAssociatedUserCards
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
