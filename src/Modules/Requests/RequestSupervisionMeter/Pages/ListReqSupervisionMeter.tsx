import { useMemo, useState } from "react";
import type { RequestState } from "../../StateRequest/Model/RequestState";
import { useGetAllRequestStates } from "../../StateRequest/Hooks/RequestStateHook";
import { useSearchReqSupervisionMeter } from "../Hooks/ReqSupervisionMeterHooks";
import type { ReqSupervisionMeter } from "../Models/ReqSupervisionMeter";
import ResumeReqAvailWater from "../../Components/Cards/ResumeReqAvailWater";
import ReqSupervisionMeterHeaderBar from "../Components/PaginationReqSupervisionMeter/ReqSupervisionMeterHeaderBar";
import ReqSupervisionMeterTable from "../Components/ReqSupervisionMeterTable/ReqSupervisonMeterTable";
import CreateRequestSupervisionMeter from "../../../Request-Abonados/Components/Supervision-Meter/CreateRequestSupervisionMeter";
import CreateChangeMeterModal from "../../../Request-Abonados/Components/Change-Meter/CreateChangeMeterModal";
import CreateAssociatedRqModal from "../../../Request-Abonados/Components/Associated-rq/CreateAssociatedRqModal";
import CreateAvailabilityWaterRqModal from "../../../Request-Abonados/Components/AvailabilityWater/CreateAvailabilityWaterRqModal";

export default function ListReqSupervisionMeter() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // 🔎 Texto visible en el input
  const [search, setSearch] = useState("");

  
  const [UserName, setUserName] = useState<string | undefined>(undefined);       // ★ se llena desde `search`
  const [Justification, setJustification] = useState<string | undefined>(undefined);
  const [State, setState] = useState<string | undefined>(undefined);             // "true" | "false" | undefined
  const [StateRequestId, setStateRequestId] = useState<number | undefined>(undefined);

  // ★ Cuando cambia el texto del buscador, mapeamos a UserName y reiniciamos la paginación
  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    const trimmed = txt.trim();
    setUserName(trimmed ? trimmed : undefined);
    setPage(1);
  };

  const handleStateChange = (newState: string) => {
     setState(newState === "" ? undefined : newState); // guardamos tal cual el valor del select
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

  const params = useMemo(
    () => ({ page, limit, Justification, State:
      State === undefined
        ? undefined
        : State === "true"
        ? "1"
        : "0", // ← conversión aquí antes de enviar
     UserName, StateRequestId }),
    [page, limit, Justification, State, UserName, StateRequestId]
  );

  const { data, isLoading, error } = useSearchReqSupervisionMeter(params);
  const rows: ReqSupervisionMeter[] = data?.data ?? [];
  const meta =
    data?.meta ?? { total: 0, page: 1, limit, pageCount: 1, hasNextPage: false, hasPrevPage: false };

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
      <h1 className="text-2xl font-bold text-[#091540]">Lista de Solicitudes de Revisión de Medidor</h1>
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

      <ReqSupervisionMeterHeaderBar
        limit={meta.limit}
        total={meta.total}
        search={search}                       // ★ valor visible del input
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
        onSearchChange={handleSearchChange}   // ★ propaga cambios de input
        onCleanFilters={handleCleanFilters}
      />

      <div className="overflow-x-auto shadow-xl border border-gray-200 rounded">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">Ocurrió un error al cargar las solicitudes.</div>
        ) : (
          <ReqSupervisionMeterTable
            data={rows}
            total={meta.total}
            page={meta.page}
            pageCount={meta.pageCount}
            onPageChange={setPage}
          />
        )}
      </div>
      <div className="flex flex-row  gap-15 items-center justify-center mt-4">
        <CreateRequestSupervisionMeter />
        <CreateChangeMeterModal />
        <CreateAssociatedRqModal />
        <CreateAvailabilityWaterRqModal />
      </div>
      
    </div>
  );
}
