// Project_State/Hooks/ProjectStateHooks.ts
import { useQuery } from "@tanstack/react-query";
import { getAllProjectStates } from "../Services/ProjectStateServices";
import type { ProjectState } from "../Models/ProjectState";

export const useGetAllProjectStates = () => {
  const { data, isPending, error } = useQuery<ProjectState[]>({
    queryKey: ["project-states"],
    queryFn: getAllProjectStates,
    // opcionales:
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: [],
    // select: (rows) => rows.slice().sort((a,b)=>a.Name.localeCompare(b.Name)),
  });

  return {
    projectStates: data ?? [],
    projectStatesLoading: isPending,
    error,
  };
};
