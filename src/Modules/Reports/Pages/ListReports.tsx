import { useMemo, useState } from "react";
import type {
  PaginatedReportsResponse,
  ReportListItem,
  ReportPaginationParams,
  ReportStateValue,
} from "../Models/Report";
import { useGetReportsByUser, useSearchReports } from "../Hooks/ReportsHooks";
import { useGetAllReportStates } from "../Hooks/ReportStatesHooks";
import { useGetAllReportTypes } from "../Hooks/ReportTypesHooks";
import { useGetAllReportLocations } from "../Hooks/ReportLocationHooks";
import { DataPagination } from "@/Components/ui/data-pagination";
import ReportHeaderBar from "../Components/Pagination/ReportHeaderBar";
import ReportsGrid from "../Components/ReportsGrid";
import ReportsCalendar from "../Components/ReportsCalendar";
import ListReportLocationsView from "../Components/ListReportLocationsView";
import ListReportTypesView from "../Components/ListReportTypesView";
import GetInfoReportModal from "../Components/Modals/GetInfoReportModal";
import CreateReportModal from "../Components/Modals/CreateReportModal";
import CreateReportLocationModal from "../Components/Modals/CreateReportLocationModal";
import CreateReportTypeModal from "../Components/Modals/CreateReportTypeModal";
import EditReportModal from "../Components/Modals/EditReportModal";
import CreateReportUserModal from "../Components/Modals/CreateReportUserModal";
import { Button } from "@/Components/ui/button";
import { LayoutGrid, Calendar, MapPin, Tags } from "lucide-react";
import { useRole } from "../../Auth/Components/RolesContext";
import { Role } from "../../Users/Models/Roles";
import { useGetUserProfile } from "../../Users/Hooks/UsersHooks";

const ListReports = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [search, setSearch] = useState("");
  const [state, setState] = useState<ReportStateValue | undefined>(undefined);
  const [reportLocationId, setReportLocationId] = useState<number | undefined>(undefined);
  const [reportTypeId, setReportTypeId] = useState<number | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("DESC");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [viewMode, setViewMode] = useState<"list" | "calendar" | "locations" | "types">("list");
  const [selectedReport, setSelectedReport] = useState<ReportListItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEditReport, setSelectedEditReport] = useState<ReportListItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateUserReportModalOpen, setIsCreateUserReportModalOpen] = useState(false);

  const { activeRole } = useRole();
  const { UserProfile } = useGetUserProfile();
  const isSubscriber = activeRole === Role.SUB;

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
    setReportLocationId(id);
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
    setReportLocationId(undefined);
    setReportTypeId(undefined);
    setSortDir("DESC");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleViewDetails = (report: ReportListItem) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReport(null);
  };

  const handleEditReport = (report: ReportListItem) => {
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
      state,
      reportLocationId,
      reportTypeId,
      sortDir,
      startDate: startDate.trim() || undefined,
      endDate: endDate.trim() || undefined,
    }),
    [page, limit, search, state, reportLocationId, reportTypeId, sortDir, startDate, endDate]
  );

  const { reportStates, isLoading: statesLoading } = useGetAllReportStates();
  const { reportTypes, isLoading: typesLoading } = useGetAllReportTypes();
  const { reportLocations, isLoading: locationsLoading } = useGetAllReportLocations();
  const {
    data: adminData,
    isLoading: isAdminLoading,
    isError: isAdminError,
    error: adminError,
  } = useSearchReports(query, { enabled: !isSubscriber });
  const {
    reports: userReports,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useGetReportsByUser(isSubscriber ? UserProfile?.Id : undefined);

  const subscriberData = useMemo<PaginatedReportsResponse>(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = userReports
      .filter((report) => {
        if (
          normalizedSearch &&
          ![
            report.Code,
            report.Description,
            report.ExactLocation,
            report.DisplayLocation,
            report.ReportedByDisplayName,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(normalizedSearch),
            )
        ) {
          return false;
        }

        if (state && report.ReportState !== state) {
          return false;
        }

        if (
          reportLocationId !== undefined &&
          report.ReportLocation?.Id !== reportLocationId
        ) {
          return false;
        }

        if (reportTypeId !== undefined && report.ReportType?.Id !== reportTypeId) {
          return false;
        }

        if (startDate) {
          const reportDate = new Date(report.CreatedAt);
          const fromDate = new Date(startDate);
          if (reportDate < fromDate) {
            return false;
          }
        }

        if (endDate) {
          const reportDate = new Date(report.CreatedAt);
          const toDate = new Date(endDate);
          toDate.setHours(23, 59, 59, 999);
          if (reportDate > toDate) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const aDate = new Date(a.CreatedAt).getTime();
        const bDate = new Date(b.CreatedAt).getTime();
        return sortDir === "ASC" ? aDate - bDate : bDate - aDate;
      });

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * limit;
    const pageData = filtered.slice(startIndex, startIndex + limit);

    return {
      data: pageData,
      meta: {
        totalItems,
        itemCount: pageData.length,
        itemsPerPage: limit,
        totalPages,
        currentPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    };
  }, [
    userReports,
    search,
    state,
    reportLocationId,
    reportTypeId,
    startDate,
    endDate,
    sortDir,
    limit,
    page,
  ]);

  const data = isSubscriber ? subscriberData : adminData;
  const isLoading = isSubscriber ? isUserLoading : isAdminLoading;
  const isError = isSubscriber ? isUserError : isAdminError;
  const error = isSubscriber ? userError : adminError;

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
              {isSubscriber ? "Mis Reportes" : "Lista de Reportes"}
            </h1>
            <p className="text-xs sm:text-base text-[#091540]/70">
              {isSubscriber
                ? "Gestione los reportes que has creado"
                : "Gestione todos los reportes del sistema"}
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
            {!isSubscriber && (
              <>
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
                <Button
                  variant={viewMode === "types" ? "default" : "outline"}
                  size="sm"
                  className="h-9 text-xs sm:text-sm justify-center"
                  onClick={() => setViewMode("types")}
                >
                  <Tags className="size-3.5 sm:size-4 shrink-0 mr-1" />
                  Tipos
                </Button>
              </>
            )}
            <div className="col-span-2 sm:col-span-1 sm:flex sm:shrink-0">
              {isSubscriber ? (
                <Button className="w-full sm:w-auto" onClick={() => setIsCreateUserReportModalOpen(true)}>
                  Crear reporte
                </Button>
              ) : viewMode === "locations" ? (
                <CreateReportLocationModal />
              ) : viewMode === "types" ? (
                <CreateReportTypeModal />
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
            reportLocationId={reportLocationId}
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

      <div>
        {!isSubscriber && viewMode === "locations" ? (
          <ListReportLocationsView />
        ) : !isSubscriber && viewMode === "types" ? (
          <ListReportTypesView />
        ) : !isSubscriber && viewMode === "calendar" ? (
          <ReportsCalendar onViewDetails={handleViewDetails} />
        ) : isLoading ? (
          <div className="p-6 sm:p-8 text-center text-muted-foreground">
            Cargando reportes...
          </div>
        ) : isError ? (
          <div className="p-6 sm:p-8 text-center text-destructive">
            {error?.message ?? "Ocurrió un error al cargar los reportes."}
          </div>
        ) : (
          <ReportsGrid
            reports={items}
            onViewDetails={handleViewDetails}
            onEditReport={isSubscriber ? undefined : handleEditReport}
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

      {selectedReport && (
        <GetInfoReportModal
          report={selectedReport}
          open={isDetailModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {selectedEditReport && !isSubscriber && (
        <EditReportModal
          report={selectedEditReport}
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
        />
      )}

      {isSubscriber && (
        <CreateReportUserModal
          open={isCreateUserReportModalOpen}
          setOpen={setIsCreateUserReportModalOpen}
        />
      )}
    </section>
  );
};

export default ListReports;
