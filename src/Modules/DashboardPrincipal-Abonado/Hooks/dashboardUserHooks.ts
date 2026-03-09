import { useQuery } from "@tanstack/react-query";
import { getMyRequestsSummary, type MyRequestsSummary } from "../Services/dashboardUserService";

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
