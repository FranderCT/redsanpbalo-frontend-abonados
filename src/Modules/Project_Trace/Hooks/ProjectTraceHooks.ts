import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createProjectTrace, getProjectTraceById } from "../Services/ProjectTraceServices";

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