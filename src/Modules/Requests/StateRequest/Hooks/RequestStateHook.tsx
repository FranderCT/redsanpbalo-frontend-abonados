import { useQuery } from "@tanstack/react-query";
import type { RequestState } from "../Model/RequestState";
import { getAllRequestStates } from "../Services/RequestStateService";

export const useGetAllRequestStates = () => {
  const { data, isPending, error } = useQuery<RequestState[]>({
    queryKey: ["request-states", "all"],
    queryFn: getAllRequestStates,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
  });

  return {
    requestStates: data ?? [],
    isPending,
    error,
  };
};
