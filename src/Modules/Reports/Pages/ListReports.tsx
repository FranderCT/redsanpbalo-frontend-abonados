import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { ReportPaginationParams, Report } from "../Models/Report";
import type { ReportStateValue } from "../Models/ReportEnums";
import { useSearchReports } from "../Hooks/ReportsHooks";
import { useReportStateOptions } from "../Hooks/ReportStatesHooks";
import { useGetAllReportTypes } from "../Hooks/ReportTypesHooks";
import { useGetAllReportLocations } from "../Hooks/ReportLocationHooks";
import { DataPagination } from "@/Components/ui/data-pagination";
import ReportHeaderBar from "../Components/Pagination/ReportHeaderBar";
import ReportsGrid from "../Components/ReportsGrid";
import ReportsCalendar from "../Components/ReportsCalendar";
import ListReportLocationsView from "../Components/ListReportLocationsView";
import CreateReportModal from "../Components/Modals/CreateReportModal";
import CreateReportLocationModal from "../Components/Modals/CreateReportLocationModal";
import { Button } from "@/Components/ui/button";
import { LayoutGrid, Calendar, MapPin } from "lucide-react";

const ListReports = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [search, setSearch] = useState("");
  const [state, setState] = useState<ReportStateValue | undefined>(undefined);
  const [locationId, setLocationId] = useState<number | undefined>(undefined);
  const [reportTypeId, setReportTypeId] = useState<number | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("DESC");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [viewMode, setViewMode] = useState<"list" | "calendar" | "locations">("list");

  const handleOpenReport = (report: Report) => {
    navigate({ to: "/dashboard/reports/$reportId", params: { reportId: String(report.Id) } });
  };

  const handleSearch = (txt: string) => {
    setSearch(txt);
    setPage(1);
  };

  const handleStateChange = (value: ReportStateValue | undefined) => {
    setState(value);
    setPage(1);
  };

  const handleTypeChange = (id: number | undefined) => {
    setReportTypeId(id);
    setPage(1);
  };

  const handleLocationChange = (id: number | undefined) => {
    setLocationId(id);
    setPage(1);
  };

  const handleSortDirChange = (dir: "ASC" | "DESC") => {
    setSortDir(dir);
    setPage(1);
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setPage(1);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setState(undefined);
    setLocationId(undefined);
    setReportTypeId(undefined);
    setSortDir("DESC");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const query = useMemo<ReportPaginationParams>(
    () => ({
      page,
      limit,
      q: search.trim() || undefined,
      state,
      locationId,
      reportTypeId,
      sortDir,
      startDate: startDate.trim() || undefined,
      endDate: endDate.trim() || undefined,
    }),
    [page, limit, search, state, locationId, reportTypeId, sortDir, startDate, endDate]
  );

  const { reportStateOptions, isLoading: statesLoading } = useReportStateOptions();
  const { reportTypes, isLoading: typesLoading } = useGetAllReportTypes();
  const { reportLocations, isLoading: locationsLoading } = useGetAllReportLocations();
  const { data, isLoading, isError, error } = useSearchReports(query);

  const items = data?.data ?? [];
  const meta = data?.meta ?? {
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: limit,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return (
    <section className="flex flex-col p-3 sm:p-6 space-y-4 md:space-y-6 min-w-0 overflow-x-hidden">
      <header className="space-y-3 shrink-0 min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-[#091540] truncate">
              Lista de Reportes
            </h1>
            <p className="text-xs sm:text-base text-[#091540]/70">
              Gestione todos los reportes del sistema
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-stretch gap-2 min-w-0">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              className="h-9 text-xs sm:text-sm justify-center"
              onClick={() => setViewMode("list")}
            >
              <LayoutGrid className="size-3.5 sm:size-4 shrink-0 mr-1" />
              Lista
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              className="h-9 text-xs sm:text-sm justify-center"
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="size-3.5 sm:size-4 shrink-0 mr-1" />
              Calendario
            </Button>
            <Button
              variant={viewMode === "locations" ? "default" : "outline"}
              size="sm"
              className="h-9 text-xs sm:text-sm justify-center"
              onClick={() => setViewMode("locations")}
            >
              <MapPin className="size-3.5 sm:size-4 shrink-0 mr-1" />
              Ubicaciones
            </Button>
            <div className="col-span-2 sm:col-span-1 sm:flex sm:shrink-0">
              {viewMode === "locations" ? (
                <CreateReportLocationModal />
              ) : (
                <CreateReportModal />
              )}
            </div>
          </div>
        </div>
        <div className="border-b border-dashed border-gray-300 pt-2" />
      </header>

      {viewMode === "list" && (
      <div className="space-y-4 flex-shrink-0">
        <ReportHeaderBar
          limit={limit}
          totalItems={meta.totalItems}
          search={search}
          sortDir={sortDir}
          startDate={startDate}
          endDate={endDate}
          state={state}
          locationId={locationId}
          reportTypeId={reportTypeId}
          reportStateOptions={reportStateOptions}
          reportTypes={reportTypes ?? []}
          reportLocations={reportLocations ?? []}
          statesLoading={statesLoading}
          typesLoading={typesLoading}
          locationsLoading={locationsLoading}
          onSearchChange={handleSearch}
          onSortDirChange={handleSortDirChange}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onStateChange={handleStateChange}
          onLocationChange={handleLocationChange}
          onReportTypeChange={handleTypeChange}
          onLimitChange={setLimit}
          onCleanFilters={handleResetFilters}
          rightAction={null}
        />
      </div>
      )}

      <div className="">
        {viewMode === "locations" ? (
          <ListReportLocationsView />
        ) : viewMode === "calendar" ? (
          <ReportsCalendar onViewDetails={handleOpenReport} />
        ) : isLoading ? (
          <div className="p-6 sm:p-8 text-center text-muted-foreground">
            Cargando reportes…
          </div>
        ) : isError ? (
          <div className="p-6 sm:p-8 text-center text-destructive">
            {error?.message ?? "Ocurrió un error al cargar los reportes."}
          </div>
        ) : (
          <ReportsGrid
            reports={items}
            emptyText="No se encontraron reportes con los filtros aplicados."
          />
        )}
      </div>

      {viewMode === "list" && meta.totalPages > 0 && (
        <div className="pt-4 border-t border-border flex-shrink-0">
          <DataPagination
            page={meta.currentPage}
            pageCount={meta.totalPages}
            total={meta.totalItems}
            pageSize={meta.itemsPerPage}
            onPageChange={setPage}
            labels={{ totalItems: "reportes" }}
            compact
          />
        </div>
      )}

    </section>
  );
};

export default ListReports;
