import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/core/pagination/pagination";
import { showApiErrorToast } from "@/core/api-error";
import type { Report, ReportPaginationParams } from "../Models/Report";
import {
  getAllReports,
  getReportById,
  searchReports,
  createReportByAdmin,
  createReportByUser,
  updateReport,
  patchReportState,
  getMonthlyCountsByLocation,
  exportReportsPdf,
  getReportAssignments,
  addReportAssignment,
  type AddAssignmentPayload,
  getReportStateHistory,
  getReportComments,
  addReportComment,
  type CreateReportCommentPayload,
  type ChangeReportStatePayload,
} from "../Services/ReportSV";

export const useGetAllReports = () => {
    const {data: reports, error, isLoading} = useQuery({
        queryKey: ['reports'],
        queryFn: getAllReports
    })
    return {reports, error, isLoading}
}

export const useSearchReports = (query: ReportPaginationParams) => {
    const { data, isLoading, isError, error } = useQuery<PaginatedResponse<Report>, Error>({
        queryKey: ["reports", "search", query],
        queryFn: () => searchReports(query),
        placeholderData: keepPreviousData,
        staleTime: 30_000,
    });
    return { data, isLoading, isError, error };
};

export const useCreateReportByAdmin = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createReportByAdmin,
        onSuccess: () => {
            console.log("Reporte creado exitosamente");
            // Invalidar las queries para refrescar la lista
            queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
        onError: (error) => {
            showApiErrorToast(error);
        }
    });
};

export const useCreateReportByUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createReportByUser,
        onSuccess: () => {
            console.log("Reporte creado exitosamente por usuario");
            queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
        onError: (error) => {
            console.error("Error al crear el reporte:", error);
        }
    });
};

export const useGetReportById = (reportId: number | null) => {
  return useQuery({
    queryKey: ["report", reportId],
    queryFn: () => getReportById(reportId!),
    enabled: reportId != null && !isNaN(reportId),
  });
};

export const useGetReportAssignments = (reportId: number | null) => {
  return useQuery({
    queryKey: ["reports", reportId, "assignments"],
    queryFn: () => getReportAssignments(reportId!),
    enabled: reportId != null && !isNaN(reportId),
  });
};

export const useAddReportAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reportId,
      payload,
    }: { reportId: number; payload: AddAssignmentPayload }) =>
      addReportAssignment(reportId, payload),
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports", reportId, "assignments"] });
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
    },
  });
};

export const useGetReportStateHistory = (reportId: number | null) => {
  return useQuery({
    queryKey: ["reports", reportId, "state-history"],
    queryFn: () => getReportStateHistory(reportId!),
    enabled: reportId != null && !isNaN(reportId),
  });
};

export const useGetReportComments = (
  reportId: number | null,
  requestUserId?: number
) => {
  return useQuery({
    queryKey: ["reports", reportId, "comments", requestUserId],
    queryFn: () => getReportComments(reportId!, requestUserId),
    enabled: reportId != null && !isNaN(reportId),
  });
};

export const useAddReportComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reportId,
      payload,
    }: { reportId: number; payload: CreateReportCommentPayload }) =>
      addReportComment(reportId, payload),
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: ["reports", reportId, "comments"] });
    },
  });
};

/** Cambio de estado dedicado (PATCH /reports/:id/state) — actualiza historial y emite socket */
export const useChangeReportState = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reportId,
      payload,
    }: { reportId: number; payload: ChangeReportStatePayload }) =>
      patchReportState(reportId, payload),
    onSuccess: (updatedReport) => {
      const id = updatedReport?.Id;
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      if (id != null) {
        queryClient.invalidateQueries({ queryKey: ["report", id] });
        queryClient.invalidateQueries({ queryKey: ["reports", id, "state-history"] });
      }
    },
  });
};

export const useUpdateReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reportId, payload }: { reportId: string; payload: any }) =>
            updateReport(reportId, payload),
        onSuccess: (_, { reportId }) => {
            queryClient.invalidateQueries({ queryKey: ["reports"] });
            if (reportId) {
              queryClient.invalidateQueries({ queryKey: ["report", Number(reportId)] });
            }
        },
        onError: (error) => {
            console.error("Error al actualizar el reporte:", error);
        }
    });
};

/** Reportes por mes y ubicación para gráficos por barrio */
export const useGetMonthlyCountsByLocation = (opts: {
  months?: number;
  year?: number;
  month?: number;
} = {}) => {
  const { months = 12, year, month } = opts;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "reports",
      "stats",
      "monthly-by-location",
      { months, year, month },
    ],
    queryFn: () => getMonthlyCountsByLocation({ months, year, month }),
    staleTime: 60_000,
  });
  return { data, isLoading, isError, error };
};

/** Descarga el PDF de reportes del mes/año (listado + gráfico por ubicación) */
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const useExportReportsPdf = () => {
  return useMutation({
    mutationFn: ({ year, month }: { year: number; month: number }) =>
      exportReportsPdf(year, month),
    onSuccess: ({ blob, filename }) => {
      triggerDownload(blob, filename);
    },
  });
};