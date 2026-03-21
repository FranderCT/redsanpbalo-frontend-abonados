// Modules/Requests/RequestChangeMeterr/Pages/ListRequestChangeMeter.tsx
import { useEffect, useMemo, useState } from "react";
import { useGetAllRequestStates } from "../../StateRequest/Hooks/RequestStateHook";
import { useSearchRequestAssociated } from "../Hooks/ReqAssociatedHooks";
import type { ReqAssociated } from "../Models/RequestAssociated";
import type { PaginationMeta } from "../../../../assets/Dtos/PaginationCategory";
import ReqAssociatedHeaderBar from "../Components/PaginationReqAssociated/ReqAssociatedHeaderBar";
import ReqAssociatedCards from "../Components/ReqAssociatedCards/ReqAssociatedCards";
import CreateAssociatedRqModalAdmin from "../Components/Modals/AddCreateAssociatedRqModal";

type LegacyMeta = {
  page?: number;
  limit?: number;
  total?: number;
  pageCount?: number;
};
export default function ListReqAssociated() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Texto visible en el input
  const [search, setSearch] = useState("");

  // Filtros que van al backend
  const [q, setQ] = useState<string | undefined>(undefined);
  const [StateRequestId, setStateRequestId] = useState<number | undefined>(undefined);

  // Buscador -> q
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

  // Estados disponibles
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

  const { data, isLoading, error } = useSearchRequestAssociated (params);
  const rows: ReqAssociated[] = data?.data ?? [];
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
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#091540]">Lista de Solicitudes para Ser Asociado</h1>
        <p className="text-md text-[#091540]/70">
          Gestione las solicitudes desde una vista simple, enfocada en filtros y acciones.
        </p>
      </section>

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
        rightAction={<CreateAssociatedRqModalAdmin />}
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
