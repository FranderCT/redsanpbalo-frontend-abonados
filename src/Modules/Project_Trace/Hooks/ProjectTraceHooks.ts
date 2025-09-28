import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProjectTrace } from "../Services/ProjectTraceServices";

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