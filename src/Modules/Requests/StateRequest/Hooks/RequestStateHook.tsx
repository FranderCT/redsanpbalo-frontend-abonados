import { useQuery } from "@tanstack/react-query";
import type { RequestState } from "../Model/RequestState";
import { getAllRequestStates } from "../Services/RequestStateService";

export const useGetAllRequestStates = () => {
  const { data, isPending, error } = useQuery<RequestState[]>({
    queryKey: ["state-request"],
    queryFn: getAllRequestStates,
    // opcionales:
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: [],
    // select: (rows) => rows.slice().sort((a,b)=>a.Name.localeCompare(b.Name)),
  });

  return {
    reqAvailWaterStates: data ?? [],
    reqAvailWaterStatesLoading: isPending,
    error,
  };
};
