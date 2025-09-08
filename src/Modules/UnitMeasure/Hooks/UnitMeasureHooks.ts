import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createUnitMeasure, getAllUnitsMeasure, UpdateUnitMeasure } from "../Services/UnitMeasureServices";
import type { NewUnit, Unit } from "../Models/unit";

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

export const useUpdateUnitMeasure = () =>{
    const qc = useQueryClient();

    const mutation = useMutation<Unit, Error, {id: number; data: NewUnit }>({
        mutationFn: ({id, data}) => UpdateUnitMeasure(id, data),
        onSuccess :(res)=>{
            console.log('Unidad de Medida Creada', console.log(res))
            qc.invalidateQueries({queryKey: [`units`]})
        },
        onError: (err) =>{
            console.error(err);
        }
    })

    return mutation;
}

export const useGetAllUnitsMeasure = () => {
    const {data: unit = [], isLoading, error} = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnitsMeasure,
    });

    return{unit, isLoading, error}
}