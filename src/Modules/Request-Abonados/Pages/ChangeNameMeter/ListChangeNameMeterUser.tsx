import { useMemo, useState } from "react";
import type { RequestState } from "../../../Requests/StateRequest/Model/RequestState";
import { useGetAllRequestStates } from "../../../Requests/StateRequest/Hooks/RequestStateHook";
import { useGetMyReqChangeNameMeterPaginated } from "../../Hooks/ChangeNameMeter/ChangeNameMeter";
import type { ReqChangeNameMeter } from "../../../Requests/RequestChangeNameMeter/Models/RequestChangeNameMeter";
import ResumeReqAvailWater from "../../../Requests/Components/Cards/ResumeReqAvailWater";
import ReqChangeNameMeterUserHeaderBar from "../../Components/ChangeNameMeter/ReqChangeNameMeterUserHeaderBar";
import ReqChangeNameMeterUserTable from "../../Components/ChangeNameMeter/ReqChangeNameMeterUserTable";


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

  // Estados disponibles (para el dropdown)
  const { reqAvailWaterStates = [], reqAvailWaterStatesLoading } = useGetAllRequestStates();
  const requestStates: RequestState[] = reqAvailWaterStates;
  const requestStatesLoading: boolean = reqAvailWaterStatesLoading;

  // Backend paginado (mis solicitudes) con filtros
  const { data, isLoading, error } = useGetMyReqChangeNameMeterPaginated({
    page,
    limit,
    StateRequestId: stateRequestId
  });

  const rows: ReqChangeNameMeter[] = data?.data ?? [];
  const meta = {
    total: data?.meta?.total ?? 0,
    page: data?.meta?.page ?? page,
    limit: data?.meta?.limit ?? limit,
    pageCount: data?.meta?.pageCount ?? Math.ceil((data?.meta?.total ?? 0) / limit),
    hasNextPage: data?.meta?.hasNextPage ?? false,
    hasPrevPage: data?.meta?.hasPrevPage ?? false
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

  const pageTotals = useMemo(() => {
    const acc = { total: 0, approved: 0, rejected: 0, pending: 0 };
    for (const r of rows) {
      acc.total++;
      const name = r.StateRequest?.Name?.toLowerCase() ?? "";
      if (name.includes("apro")) acc.approved++;
      else if (name.includes("rech")) acc.rejected++;
      else if (name.includes("pend") || name.includes("proce")) acc.pending++;
    }
    return acc;
  }, [rows]);

  return (
    <div className="px-6 py-4 space-y-6">
      <h1 className="text-2xl font-bold text-[#091540]">Mis Solicitudes de Cambio de Nombre Medidor</h1>
      <p className="text-[#091540]/70 text-md">Lista de solicitudes realizadas</p>
      <div className="border-b border-dashed border-gray-300 "></div>
      {/* Cards (con totales de la página actual) */}
      <ResumeReqAvailWater
        total={pageTotals.total}
        pending={pageTotals.pending}
        approved={pageTotals.approved}
        rejected={pageTotals.rejected}
        loading={isLoading || requestStatesLoading}
      />

      <div className="border-b border-dashed border-gray-300 mt-4 mb-6"></div>
      {/* Control de búsqueda y filtros */}
      <div className="mb-4">
        <ReqChangeNameMeterUserHeaderBar
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
      <div className="overflow-x-auto shadow-xl border border-gray-200 rounded">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">Ocurrió un error al cargar las solicitudes.</div>
        ) : (
          <ReqChangeNameMeterUserTable
            data={filteredRows}
            page={meta.page}
            pageCount={meta.pageCount}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
