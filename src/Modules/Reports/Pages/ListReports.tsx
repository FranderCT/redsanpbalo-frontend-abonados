import { useMemo, useState } from "react";
import type { ReportPaginationParams } from "../Models/Report";
import type { Report } from "../Models/Report";
import { useSearchReports } from "../Hooks/ReportsHooks";
import { useGetAllReportStates } from "../Hooks/ReportStatesHooks";
import { useGetAllReportTypes } from "../Hooks/ReportTypesHooks";
import { useGetAllReportLocations } from "../Hooks/ReportLocationHooks";
import ReportHeaderBar from "../Components/Pagination/ReportHeaderBar";
import ReportPager from "../Components/Pagination/ReportPager";
import ReportsGrid from "../Components/ReportsGrid";
import GetInfoReportModal from "../Components/Modals/GetInfoReportModal";
import CreateReportModal from "../Components/Modals/CreateReportModal";

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
    <section className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-[#091540]">Lista de Reportes</h1>
      <p className="text-[#091540]/70 text-md">Gestione todos los reportes del sistema</p>
      <div className="border-b border-dashed border-gray-300 mb-4"></div>

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

      <div className="w-full">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando reportes…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            Ocurrió un error al cargar los reportes.
          </div>
        ) : (
          <div>
            <ReportsGrid
              reports={items}
              onViewDetails={handleViewDetails}
              emptyText="No se encontraron reportes con los filtros aplicados."
            />
          </div>
        )}
      </div>

      <ReportPager
        page={meta.page}
        total={meta.total}
        pageCount={meta.pageCount}
        onPageChange={setPage}
        variant="box"
        className="mt-2"
        data={items}
      />

      {/* Modal de detalles */}
      {selectedReport && (
        <GetInfoReportModal
          report={selectedReport}
          open={isDetailModalOpen}
          onClose={handleCloseModal}
        />
      )}


    </section>
  );
};

export default ListReports;
