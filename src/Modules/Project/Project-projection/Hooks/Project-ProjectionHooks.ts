import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProjectProjection } from "../Services/Project-ProjectionServices";
import { projectKeys } from "../../queryKeys";

export const useCreateProjectProjection = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey: projectKeys.projectionRoot(),
        mutationFn : createProjectProjection,
        onSuccess : (res) => {
            console.log('proyeccion creada', res);
            qc.invalidateQueries({queryKey: projectKeys.all})
        },
        onError : (err) => {
            console.error('no se que paso ', err);
        }
    })
    return mutation;
}
