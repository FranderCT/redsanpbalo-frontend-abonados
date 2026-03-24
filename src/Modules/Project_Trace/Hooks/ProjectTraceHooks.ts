import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createProjectTrace, getProjectTraceById, getProjectTracesByProjectId, getTotalActualExpenseByProjectId } from "../Services/ProjectTraceServices";
import type { ProjectTrace } from "../Models/ProjectTrace";
import { projectKeys } from "../../Project/queryKeys";

type TraceProjectWithLooseProjectRef = ProjectTrace & {
  ProjectId?: number;
  projectId?: number;
  Project?: ProjectTrace["Project"] & { projectId?: number };
};

export const useCreateProjectTrace = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey: projectKeys.traceRoot(),
        mutationFn: createProjectTrace,
        onSuccess: (res)=>{
            qc.invalidateQueries({queryKey: projectKeys.all});
            qc.invalidateQueries({queryKey: projectKeys.dashboardInProcessCount});
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
    queryKey: projectKeys.traceDetail(id),
    queryFn: () => getProjectTraceById(id),
  });

  return { traceProj, isLoading, error };
};

export const useGetProjectTracesByProjectId = (projectId: number) => {
  const {data: projectTracesRaw, isLoading, error} = useQuery({
    queryKey: projectKeys.tracesByProject(projectId),
    queryFn: () => getProjectTracesByProjectId(projectId),
    enabled: !!projectId,
  });

  // Mantener un filtro defensivo en el cliente, pero sin descartar trazas
  // ya resueltas desde el detalle del proyecto aunque no incluyan ProjectId.
  const projectTraces: ProjectTrace[] = (projectTracesRaw ?? []).filter((t: TraceProjectWithLooseProjectRef) => {
    const projectIdFromTrace =
      t?.Project?.Id ??
      t?.ProjectId ??
      t?.projectId ??
      t?.Project?.projectId ??
      null;

    return projectIdFromTrace == null || Number(projectIdFromTrace) === Number(projectId);
  });

  // Log simple para debugging: cuántas trazas devuelve el endpoint vs. las filtradas
  if (projectTracesRaw && Array.isArray(projectTracesRaw)) {
    console.debug(`[useGetProjectTracesByProjectId] projectId=${projectId} raw=${projectTracesRaw.length} filtered=${projectTraces.length}`);
  }

  return { projectTraces, isLoading, error, projectTracesRaw };
};

export const useGetTotalActualExpenseByProjectId = (projectId: number) => {
  const {data: totalActualExpense, isLoading, error} = useQuery({
    queryKey: projectKeys.totalActualExpense(projectId),
    queryFn: () => getTotalActualExpenseByProjectId(projectId),
    enabled: !!projectId,
  });

  return { totalActualExpense, isLoading, error };
};
