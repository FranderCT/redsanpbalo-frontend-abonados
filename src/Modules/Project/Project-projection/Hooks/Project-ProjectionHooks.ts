import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProjectProjection } from "../Services/Project-ProjectionServices";

export const useCreateProjectProjection = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey: ["project-projection"],
        mutationFn : createProjectProjection,
        onSuccess : (res) => {
            console.log('proyeccion creada', res);
            qc.invalidateQueries({queryKey: ['project-projection']})
        },
        onError : (err) => {
            console.error('no se que paso ', err);
        }
    })
    return mutation;
}