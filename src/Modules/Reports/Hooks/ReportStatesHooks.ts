import { useQuery } from "@tanstack/react-query";
import { getReportsInProcessCount } from "../Services/ReportSV";
import {
  REPORT_STATE_OPTIONS,
  type ReportStateValue,
} from "../Models/ReportEnums";

/** Opciones de estado para filtros/selects (enum, sin API) */
export function useReportStateOptions(): {
  reportStateOptions: { value: ReportStateValue; label: string }[];
  isLoading: false;
} {
  return {
    reportStateOptions: REPORT_STATE_OPTIONS,
    isLoading: false,
  };
}

/** Compatibilidad: mismo nombre que antes pero devuelve opciones del enum */
export const useGetAllReportStates = () => {
  const { reportStateOptions } = useReportStateOptions();
  return {
    reportStates: reportStateOptions.map((o) => ({
      IdReportState: o.value,
      Name: o.label,
      IsActive: true,
    })),
    error: null,
    isLoading: false,
  };
};

export const useReportsInProcessCount = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reports", "in-process", "count"],
    queryFn: getReportsInProcessCount,
  });

  return {
    totalReportsInProcess: data ?? 0,
    isLoading,
    isError,
    error,
  };
};
