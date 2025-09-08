import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createUnitMeasure } from "../Services/UnitMeasureServices";

export const useCreateUnitMeasure = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: createUnitMeasure,
        onSuccess: (res) =>{
            console.log('Unidad de medida creada correctamente',res)
            qc.invalidateQueries({queryKey: ['units']})
        },
        onError: (err) =>{
            console.error('Error al crear', err)
        }
    })

    return mutation;
}