import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useSearchReqAvailWater } from "../Hooks/ReqAvailWaterHooks";
import { searchReqAvailWater } from "../Services/ReqAvilWaterServices";
import type { ReqAvailWater } from "../Models/ReqAvailWater";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import ReqAvailWaterTable from "../Components/ReqAvailabilityWaterTable/ReAvailWaterTable";

// ⬇️ usa el path donde realmente tienes las cards:
import ResumeReqAvailWater from "../../Components/Cards/ResumeReqAvailWater";
import { useGetAllRequestStates } from "../../StateRequest/Hooks/RequestStateHook";
import ReqAvailWaterHeaderBar from "../Components/PaginationReqAvailabilityWater/ReqAvailWaterHeaderBar";
import CreateRequest from "../Components/Modals/CreateRequest";

export default function ListReqAvailWater() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const [justification, setJustification] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [stateRequestId, setStateRequestId] = useState<number | undefined>(undefined);

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

  const { projectStates = [], projectStatesLoading } = useGetAllRequestStates();

  // IDs de estados (ajusta includes según el nombre real en tu catálogo)
  const pendingId = useMemo(
    () => projectStates.find((s) => s.Name.toLowerCase().includes("pend"))?.Id,
    [projectStates]
  );
  const approvedId = useMemo(
    () => projectStates.find((s) => s.Name.toLowerCase().includes("apro"))?.Id,
    [projectStates]
  );
  const rejectedId = useMemo(
    () => projectStates.find((s) => s.Name.toLowerCase().includes("rech"))?.Id,
    [projectStates]
  );

  // Filtros base para tarjetas (sin stateRequestId)
  const baseFilters = useMemo(
    () => ({ justification, state } as const),
    [justification, state]
  );

  // Totales con useQueries (limit=1, se lee meta.total) + tipado de 'r'
  const stats = useQueries({
    queries: [
      {
        queryKey: ["reqaw", "stats", "total", baseFilters],
        queryFn: () => searchReqAvailWater({ page: 1, limit: 1, ...baseFilters }),
        select: (r: PaginatedResponse<ReqAvailWater>) => r.meta.total,
        staleTime: 30_000,
      },
      {
        queryKey: ["reqaw", "stats", "pending", baseFilters, pendingId],
        queryFn: () =>
          searchReqAvailWater({
            page: 1,
            limit: 1,
            ...baseFilters,
            stateRequestId: pendingId!,
          }),
        select: (r: PaginatedResponse<ReqAvailWater>) => r.meta.total,
        enabled: !!pendingId,
        staleTime: 30_000,
      },
      {
        queryKey: ["reqaw", "stats", "approved", baseFilters, approvedId],
        queryFn: () =>
          searchReqAvailWater({
            page: 1,
            limit: 1,
            ...baseFilters,
            stateRequestId: approvedId!,
          }),
        select: (r: PaginatedResponse<ReqAvailWater>) => r.meta.total,
        enabled: !!approvedId,
        staleTime: 30_000,
      },
      {
        queryKey: ["reqaw", "stats", "rejected", baseFilters, rejectedId],
        queryFn: () =>
          searchReqAvailWater({
            page: 1,
            limit: 1,
            ...baseFilters,
            stateRequestId: rejectedId!,
          }),
        select: (r: PaginatedResponse<ReqAvailWater>) => r.meta.total,
        enabled: !!rejectedId,
        staleTime: 30_000,
      },
    ],
  });

  const total = stats[0].data ?? 0;
  const pending = stats[1].data ?? 0;
  const approved = stats[2].data ?? 0;
  const rejected = stats[3].data ?? 0;
  const statsLoading = stats.some((q) => q.isPending);

  // Data de la tabla
  const params = useMemo(
    () => ({ page, limit, justification, state, stateRequestId }),
    [page, limit, justification, state, stateRequestId]
  );
  const { data, isLoading, error } = useSearchReqAvailWater(params);
  const rows: ReqAvailWater[] = data?.data ?? [];
  const meta =
    data?.meta ?? { total: 0, page: 1, limit, pageCount: 1, hasNextPage: false, hasPrevPage: false };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-[#091540]">Lista de Solicitudes</h1>
      <p className="text-[#091540]/70 text-md">Gestione todas las solicitudes</p>
      <div className="border-b border-dashed border-gray-300 mb-2"></div>

      {/* Tarjetas de resumen */}
      <ResumeReqAvailWater
        total={total}
        pending={pending}
        approved={approved}
        rejected={rejected}
        loading={statsLoading || projectStatesLoading}
      />

      <div className="border-b border-dashed border-gray-300 mt-4 mb-6"></div>

      <ReqAvailWaterHeaderBar
        limit={meta.limit}
        search={search}
        state={state}
        requestStateId={stateRequestId}
        states={projectStates}
        statesLoading={projectStatesLoading}
        onStateRequestChange={handleStateRequestChange}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onFilterClick={handleStateChange}
        onSearchChange={handleSearchChange}
        onCleanFilters={handleCleanFilters}
         rightAction={<CreateRequest onCreated={() => setPage(1)} />}
      />

      <div className="overflow-x-auto shadow-xl border border-gray-200 rounded">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            Ocurrió un error al cargar las solicitudes.
          </div>
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
