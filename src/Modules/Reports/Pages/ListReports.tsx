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
import GetInfoReportModal from "../Components/Modals/GetInfoReportModal";
import CreateReportModal from "../Components/Modals/CreateReportModal";
import EditReportModal from "../Components/Modals/EditReportModal";

const ListReports = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [stateId, setStateId] = useState<number | undefined>(undefined);
  const [locationId, setLocationId] = useState<number | undefined>(undefined);
  const [reportTypeId, setReportTypeId] = useState<number | undefined>(undefined);
  
    // Estado para el modal de detalles
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Estado para el modal de edición
  const [selectedEditReport, setSelectedEditReport] = useState<Report | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleSearch = (txt: string) => {
    setSearch(txt);
    setPage(1);
  };

  const handleStateChange = (stateId: number | undefined) => {
    setStateId(stateId);
    setPage(1);
  };

  const handleTypeChange = (typeId: number | undefined) => {
    setReportTypeId(typeId);
    setPage(1);
  };

  const handleLocationChange = (locationId: number | undefined) => {
    setLocationId(locationId);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStateId(undefined);
    setLocationId(undefined);
    setReportTypeId(undefined);
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

  const params: ReportPaginationParams = useMemo(
    () => ({ 
      page, 
      limit, 
      search: search || undefined,
      stateId, 
      locationId, 
      ReportTypeId: reportTypeId 
    }),
    [page, limit, search, stateId, locationId, reportTypeId]
  );

  // Hooks para obtener datos
  const { reportStates, isLoading: statesLoading } = useGetAllReportStates();
  const { reportTypes, isLoading: typesLoading } = useGetAllReportTypes();
  const { reportLocations, isLoading: locationsLoading } = useGetAllReportLocations();
  const { data, isLoading, error } = useSearchReports(params);

  const items = data?.data ?? [];
  const meta = data?.meta ?? {
    total: 0,
    page: 1,
    limit,
    pageCount: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return (
    <section className="min-h-0 flex flex-col p-4 sm:p-6 space-y-4 md:space-y-6">
      <header className="space-y-1 shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold text-[#091540]">
          Lista de Reportes
        </h1>
        <p className="text-sm sm:text-base text-[#091540]/70">
          Gestione todos los reportes del sistema
        </p>
        <div className="border-b border-dashed border-gray-300 pt-2" />
      </header>

      <div className="space-y-4 flex-shrink-0">
        <ReportHeaderBar
          limit={limit}
          total={meta.total}
          search={search}
          stateId={stateId}
          locationId={locationId}
          reportTypeId={reportTypeId}
          reportStates={reportStates ?? []}
          reportTypes={reportTypes ?? []}
          reportLocations={reportLocations ?? []}
          statesLoading={statesLoading}
          typesLoading={typesLoading}
          locationsLoading={locationsLoading}
          onStateChange={handleStateChange}
          onLocationChange={handleLocationChange}
          onReportTypeChange={handleTypeChange}
          onLimitChange={setLimit}
          onSearchChange={handleSearch}
          onCleanFilters={handleResetFilters}
          rightAction={<CreateReportModal />}
        />
      </div>

      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="p-6 sm:p-8 text-center text-muted-foreground">
            Cargando reportes…
          </div>
        ) : error ? (
          <div className="p-6 sm:p-8 text-center text-destructive">
            Ocurrió un error al cargar los reportes.
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

      {!isLoading && !error && meta.pageCount > 0 && (
        <div className="pt-4 border-t border-border flex-shrink-0">
          <DataPagination
            page={meta.page}
            pageCount={meta.pageCount}
            total={meta.total}
            pageSize={limit}
            onPageChange={setPage}
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
