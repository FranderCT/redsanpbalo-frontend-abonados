import { useMemo, useState } from "react";
import { useSearchReqAvailWater } from "../Hooks/ReqAvailWaterHooks";
import type { ReqAvailWater } from "../Models/ReqAvailWater";
import ReqAvailWaterTable from "../Components/ReqAvailabilityWaterTable/ReAvailWaterTable";

// Cards
import ResumeReqAvailWater from "../../Components/Cards/ResumeReqAvailWater";
// Filtros de estado
import { useGetAllRequestStates } from "../../StateRequest/Hooks/RequestStateHook";
import ReqAvailWaterHeaderBar from "../Components/PaginationReqAvailabilityWater/ReqAvailWaterHeaderBar";
import type { RequestState } from "../../StateRequest/Model/RequestState";

export default function ListReqAvailWater() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const [Justification, setJustification] = useState<string | undefined>(undefined);
  const [State, setState] = useState<string | undefined>(undefined); // "1" | "0" | undefined
  const [StateRequestId, setStateRequestId] = useState<number | undefined>(undefined);

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    const trimmed = txt.trim();
    setJustification(trimmed ? trimmed : undefined);
    setPage(1);
  };

  const handleStateChange = (newState: string) => {
    setState(newState || undefined);
    setPage(1);
  };

  const handleStateRequestChange = (id?: number) => {
    setStateRequestId(id);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setJustification(undefined);
    setState(undefined);
    setStateRequestId(undefined);
    setPage(1);
  };

  // Estados disponibles (para el dropdown)
  const {
    reqAvailWaterStates = [],
    reqAvailWaterStatesLoading,
  } = useGetAllRequestStates();
  const requestStates: RequestState[] = reqAvailWaterStates;
  const requestStatesLoading: boolean = reqAvailWaterStatesLoading;

  // Data de la tabla
  const params = useMemo(
    () => ({ page, limit, Justification, State, StateRequestId }),
    [page, limit, Justification, State, StateRequestId]
  );
  const { data, isLoading, error } = useSearchReqAvailWater(params);
  const rows: ReqAvailWater[] = data?.data ?? [];
  const meta =
    data?.meta ?? { total: 0, page: 1, limit, pageCount: 1, hasNextPage: false, hasPrevPage: false };

  // ✅ Totales SOLO de la página actual (rápido y sin llamadas extra):
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
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-[#091540]">Lista de Solicitudes</h1>
      <p className="text-[#091540]/70 text-md">Gestione todas las solicitudes</p>
      <div className="border-b border-dashed border-gray-300 mb-2"></div>

      {/* Cards (con totales de la página actual) */}
      <ResumeReqAvailWater
        total={pageTotals.total}
        pending={pageTotals.pending}
        approved={pageTotals.approved}
        rejected={pageTotals.rejected}
        loading={isLoading || requestStatesLoading}
      />

      <div className="border-b border-dashed border-gray-300 mt-4 mb-6"></div>

      <ReqAvailWaterHeaderBar
        limit={meta.limit}
        total={meta.total}
        search={search}
        state={State}
        requestStateId={StateRequestId}
        states={requestStates}
        statesLoading={requestStatesLoading}
        onStateRequestChange={handleStateRequestChange}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onFilterClick={handleStateChange}
        onSearchChange={handleSearchChange}
        onCleanFilters={handleCleanFilters}
      />

      <div className="overflow-x-auto shadow-xl border border-gray-200 rounded">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">Ocurrió un error al cargar las solicitudes.</div>
        ) : (
          <ReqAvailWaterTable
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
