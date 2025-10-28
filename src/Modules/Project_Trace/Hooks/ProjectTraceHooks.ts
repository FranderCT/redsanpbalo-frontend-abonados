import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createProjectTrace, getProjectTraceById, getProjectTracesByProjectId, getTotalActualExpenseByProjectId } from "../Services/ProjectTraceServices";

export const useCreateProjectTrace = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['project-trace'],
        mutationFn: createProjectTrace,
        onSuccess: (res)=>{
            qc.invalidateQueries({queryKey: ['project-trace']});
            console.log(res)
        },
        onError: (err)=>{
            console.error(err)
        }

    })
    return mutation;
}

export const useGetProjectTraceById = (id: number) => {

  const {data: traceProj, isLoading,error} = useQuery({
    queryKey: ["project-trace", id],
    queryFn: () => getProjectTraceById(id),
  });

  return { traceProj, isLoading, error };
};

export const useGetProjectTracesByProjectId = (projectId: number) => {
  const {data: projectTraces, isLoading, error} = useQuery({
    queryKey: ["project-traces", projectId],
    queryFn: () => getProjectTracesByProjectId(projectId),
    enabled: !!projectId,
  });

  return { projectTraces, isLoading, error };
};

export const useGetTotalActualExpenseByProjectId = (projectId: number) => {
  const {data: totalActualExpense, isLoading, error} = useQuery({
    queryKey: ["total-actual-expense", projectId],
    queryFn: () => getTotalActualExpenseByProjectId(projectId),
    enabled: !!projectId,
  });

  return { totalActualExpense, isLoading, error };
};