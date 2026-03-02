import { useMemo, useState } from "react";
import type { ReportPaginationParams } from "../Models/Report";
import type { Report } from "../Models/Report";
import { useSearchReports } from "../Hooks/ReportsHooks";
import { useGetAllReportStates } from "../Hooks/ReportStatesHooks";
import { useGetAllReportTypes } from "../Hooks/ReportTypesHooks";
import { useGetAllReportLocations } from "../Hooks/ReportLocationHooks";
import { DataPagination } from "@/Components/ui/data-pagination";
import ReportHeaderBar from "../Components/Pagination/ReportHeaderBar";
import ReportsGrid from "../Components/ReportsGrid";
import ReportsCalendar from "../Components/ReportsCalendar";
import ListReportLocationsView from "../Components/ListReportLocationsView";
import GetInfoReportModal from "../Components/Modals/GetInfoReportModal";
import CreateReportModal from "../Components/Modals/CreateReportModal";
import CreateReportLocationModal from "../Components/Modals/CreateReportLocationModal";
import EditReportModal from "../Components/Modals/EditReportModal";
import { Button } from "@/Components/ui/button";
import { LayoutGrid, Calendar, MapPin } from "lucide-react";

const ListReports = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [search, setSearch] = useState("");
  const [stateId, setStateId] = useState<number | undefined>(undefined);
  const [locationId, setLocationId] = useState<number | undefined>(undefined);
  const [reportTypeId, setReportTypeId] = useState<number | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("DESC");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [viewMode, setViewMode] = useState<"list" | "calendar" | "locations">("list");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEditReport, setSelectedEditReport] = useState<Report | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSearch = (txt: string) => {
    setSearch(txt);
    setPage(1);
  };

  const handleStateChange = (id: number | undefined) => {
    setStateId(id);
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
    setStateId(undefined);
    setLocationId(undefined);
    setReportTypeId(undefined);
    setSortDir("DESC");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReport(null);
  };

  const handleEditReport = (report: Report) => {
    setSelectedEditReport(report);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEditReport(null);
  };

  const query = useMemo<ReportPaginationParams>(
    () => ({
      page,
      limit,
      q: search.trim() || undefined,
      stateId,
      locationId,
      reportTypeId,
      sortDir,
      startDate: startDate.trim() || undefined,
      endDate: endDate.trim() || undefined,
    }),
    [page, limit, search, stateId, locationId, reportTypeId, sortDir, startDate, endDate]
  );

  const { reportStates, isLoading: statesLoading } = useGetAllReportStates();
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
    <section className=" flex flex-col p-4 sm:p-6 space-y-4 md:space-y-6">
      <header className="space-y-1 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#091540]">
              Lista de Reportes
            </h1>
            <p className="text-sm sm:text-base text-[#091540]/70">
              Gestione todos los reportes del sistema
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <LayoutGrid className="size-4 mr-1.5" />
              Lista
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="size-4 mr-1.5" />
              Calendario
            </Button>
            <Button
              variant={viewMode === "locations" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("locations")}
            >
              <MapPin className="size-4 mr-1.5" />
              Ubicaciones
            </Button>
            {viewMode === "locations" ? (
              <CreateReportLocationModal />
            ) : (
              <CreateReportModal />
            )}
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
          stateId={stateId}
          locationId={locationId}
          reportTypeId={reportTypeId}
          reportStates={reportStates ?? []}
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

      <div className="flex-1 min-h-0">
        {viewMode === "locations" ? (
          <ListReportLocationsView />
        ) : viewMode === "calendar" ? (
          <ReportsCalendar onViewDetails={handleViewDetails} />
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
            onViewDetails={handleViewDetails}
            onEditReport={handleEditReport}
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


      {/* Modal de detalles */}
      {selectedReport && (
        <GetInfoReportModal
          report={selectedReport}
          open={isDetailModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* Modal de edición */}
      {selectedEditReport && (
        <EditReportModal
          report={selectedEditReport}
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
        />
      )}


    </section>
  );
};

export default ListReports;
