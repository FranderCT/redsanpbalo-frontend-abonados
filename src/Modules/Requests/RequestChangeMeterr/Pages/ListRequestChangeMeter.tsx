// Modules/Requests/RequestChangeMeterr/Pages/ListRequestChangeMeter.tsx
import { useMemo, useState } from "react";
import { useGetAllRequestStates } from "../../StateRequest/Hooks/RequestStateHook";
import { useSearchReqChangeMeter } from "../Hooks/RequestChangeMeter"; // Asegúrate que el path/nombre coincidan
import ResumeReqAvailWater from "../../Components/Cards/ResumeReqAvailWater";
import ReqChangeMeterTable from "../Components/RequestChangeMeterTable/RequestChangeMeterTable";
import ReqChangeMeterHeaderBar from "../Components/PaginationRequestChangeMeter/RequestChangeMeterHeaderBar";
import type { ReqChangeMeter } from "../Models/RequestChangeMeter";
import CreateChangeMeterModal from "../Modals/AddChangeMterRequestModal";


export default function ListReqChangeMeter() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Texto visible en el input
  const [search, setSearch] = useState("");

  // Filtros que van al backend
  const [UserName, setUserName] = useState<string | undefined>(undefined);
  const [State, setState] = useState<string | undefined>(undefined); // "true" | "false" | undefined
  const [StateRequestId, setStateRequestId] = useState<number | undefined>(undefined);

  // Buscador → UserName
  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    const trimmed = txt.trim();
    setUserName(trimmed ? trimmed : undefined);
    setPage(1);
  };

  const handleStateChange = (newState: string) => {
    setState(newState === "" ? undefined : newState); // "" -> undefined
    setPage(1);
  };

  const handleStateRequestChange = (id?: number) => {
    setStateRequestId(id);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setUserName(undefined);
    setState(undefined);
    setStateRequestId(undefined);
    setPage(1);
  };

  // Estados disponibles
  const { requestStates = [], isPending: requestStatesLoading } = useGetAllRequestStates();

 
  const params = useMemo(
    () => ({
      page,
      limit,
      UserName,
      State: State ?? "", 
      StateRequestId,
    }),
    [page, limit, UserName, State, StateRequestId]
  );

  const { data, isLoading, error } = useSearchReqChangeMeter(params);
  const rows: ReqChangeMeter[] = data?.data ?? [];
  const meta =
    data?.meta ?? { total: 0, page: 1, limit, pageCount: 1, hasNextPage: false, hasPrevPage: false };

  // Totales de la página actual (opcional)
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
      <h1 className="text-2xl font-bold text-[#091540]">Lista de Solicitudes de Cambio de Medidor</h1>
      <p className="text-[#091540]/70 text-md">Gestione todas las solicitudes</p>
      <div className="border-b border-dashed border-gray-300 mb-2"></div>

      <ResumeReqAvailWater
        total={pageTotals.total}
        pending={pageTotals.pending}
        approved={pageTotals.approved}
        rejected={pageTotals.rejected}
        loading={isLoading || requestStatesLoading}
      />

      <div className="border-b border-dashed border-gray-300 mt-4 mb-6"></div>

      <ReqChangeMeterHeaderBar
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
        rightAction={<CreateChangeMeterModal />}
      />

      <div className="overflow-x-auto shadow-xl border border-gray-200 rounded">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">Ocurrió un error al cargar las solicitudes.</div>
        ) : (
          <ReqChangeMeterTable
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
