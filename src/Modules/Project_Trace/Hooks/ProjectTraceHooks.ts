import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createProjectTrace, getProjectTraceById, getProjectTracesByProjectId, getTotalActualExpenseByProjectId } from "../Services/ProjectTraceServices";
import type { ProjectTrace } from "../Models/ProjectTrace";

export const useCreateProjectTrace = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['project-trace'],
        mutationFn: createProjectTrace,
        onSuccess: (res)=>{
            // Invalidar todas las queries relacionadas con seguimientos y proyectos
            qc.invalidateQueries({queryKey: ['project-trace']});
            qc.invalidateQueries({queryKey: ['project-traces']});
            qc.invalidateQueries({queryKey: ['project']});
            qc.invalidateQueries({queryKey: ['total-actual-expense']});
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
  const {data: projectTracesRaw, isLoading, error} = useQuery({
    queryKey: ["project-traces", projectId],
    queryFn: () => getProjectTracesByProjectId(projectId),
    enabled: !!projectId,
  });

  // Filtrar por projectId en el cliente — algunos endpoints devuelven trazas mezcladas
  const projectTraces: ProjectTrace[] = (projectTracesRaw ?? []).filter((t: any) => {
    const projectIdFromTrace = t?.Project?.Id ?? t?.ProjectId ?? t?.projectId ?? null;
    return Number(projectIdFromTrace) === Number(projectId);
  });

  // Log simple para debugging: cuántas trazas devuelve el endpoint vs. las filtradas
  if (projectTracesRaw && Array.isArray(projectTracesRaw)) {
    console.debug(`[useGetProjectTracesByProjectId] projectId=${projectId} raw=${projectTracesRaw.length} filtered=${projectTraces.length}`);
  }

  return { projectTraces, isLoading, error, projectTracesRaw };
};

export const useGetTotalActualExpenseByProjectId = (projectId: number) => {
  const {data: totalActualExpense, isLoading, error} = useQuery({
    queryKey: ["total-actual-expense", projectId],
    queryFn: () => getTotalActualExpenseByProjectId(projectId),
    enabled: !!projectId,
  });

  return { totalActualExpense, isLoading, error };
};