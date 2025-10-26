import { useQuery } from "@tanstack/react-query";
import { getMyReportsCountByState, getMyReportsSummary, getMyRequestsSummary, type MyReportsSummary, type MyRequestsSummary } from "../Services/dashboardUserService";

export const useMyRequestsSummary = () => {
  const { data, isLoading, isError, error } = useQuery<MyRequestsSummary>({
    queryKey: ["dashboard", "me", "requests", "summary"],
    queryFn: getMyRequestsSummary,
    staleTime: 30_000,
  });

  return {
    summary: data,
    isLoading,
    isError,
    error,
  };
};

export const useMyReportsSummary = () => {
  const { data, isLoading, isError, error } = useQuery<MyReportsSummary>({
    queryKey: ["reports", "me", "summary"],
    queryFn: getMyReportsSummary,
    staleTime: 30_000,
  });
  return { summary: data, isLoading, isError, error };
};

export const useMyReportsCountByState = (state: string) => {
  const { data, isLoading, isError, error } = useQuery<number>({
    queryKey: ["reports", "me", "count-by-state", state],
    queryFn: () => getMyReportsCountByState(state),
    enabled: !!state,
    staleTime: 30_000,
  });
  return { count: data ?? 0, isLoading, isError, error };
};