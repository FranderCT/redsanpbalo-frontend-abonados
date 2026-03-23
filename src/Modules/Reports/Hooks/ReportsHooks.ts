import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { showApiErrorToast } from "@/core/api-error";
import { mapReportApiToListItem } from "../adapters/reportAdapters";
import type {
  PaginatedReportsResponse,
  ReportPaginationParams,
  ReportStateValue,
  UpdateReportPayload,
} from "../Models/Report";
import {
  getAllReports,
  searchReports,
  createReportByAdmin,
  createReportByUser,
  uploadReportPhoto,
  assignUserInCharge,
  updateReport,
  getMonthlyCountsByLocation,
  exportReportsExcel,
  changeReportState,
} from "../Services/ReportSV";

export const useGetAllReports = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: getAllReports,
  });
  const reports = data?.map(mapReportApiToListItem);
  return { reports, error, isLoading };
};

export const useSearchReports = (query: ReportPaginationParams) => {
  const { data, isLoading, isError, error } = useQuery<
    PaginatedReportsResponse,
    Error
  >({
    queryKey: ["reports", "search", query],
    queryFn: () => searchReports(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
  const normalizedData = data
    ? {
        ...data,
        data: data.data.map(mapReportApiToListItem),
      }
    : undefined;
  return { data: normalizedData, isLoading, isError, error };
};

export const useCreateReportByAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof createReportByAdmin>[0]) =>
      createReportByAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

export const useCreateReportByUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof createReportByUser>[0]) =>
      createReportByUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

export const useUploadReportPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, photo }: { reportId: number; photo: File }) =>
      uploadReportPhoto(reportId, photo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      console.error("Error uploading photo:", error);
    },
  });
};

export const useAssignUserInCharge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      plumberUserId,
      instructions,
    }: {
      reportId: string;
      plumberUserId: number;
      instructions?: string;
    }) => assignUserInCharge(reportId, plumberUserId, instructions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      console.error("Error al asignar fontanero:", error);
    },
  });
};

export const useChangeReportState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      newState,
      reasonChange,
    }: {
      reportId: string;
      newState: ReportStateValue;
      reasonChange?: string;
    }) => changeReportState(reportId, newState, reasonChange),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      console.error("Error al cambiar estado del reporte:", error);
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      payload,
    }: {
      reportId: string;
      payload: UpdateReportPayload;
    }) => updateReport(reportId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      console.error("Error al actualizar reporte:", error);
    },
  });
};

/** Reportes por mes y ubicación para gráficos por barrio */
export const useGetMonthlyCountsByLocation = (
  opts: {
    months?: number;
    year?: number;
    month?: number;
  } = {},
) => {
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

/** Descarga el Excel de reportes del mes/año */
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

export const useExportReportsExcel = () => {
  return useMutation({
    mutationFn: ({ year, month }: { year: number; month: number }) =>
      exportReportsExcel(year, month),
    onSuccess: ({ blob, filename }) => {
      triggerDownload(blob, filename);
    },
  });
};
