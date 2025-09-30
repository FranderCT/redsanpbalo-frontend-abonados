import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createUnitMeasure, deleteUnitMeasure, getAllUnitsMeasure, searchUnits, UpdateUnitMeasure } from "../Services/UnitMeasureServices";
import type { Unit, UnitPaginationParams, UpdateUnitDto } from "../Models/unit";
import { useEffect } from "react";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";


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

    const mutation = useMutation<Unit, Error, {id: number; data: UpdateUnitDto }>({
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

export const useSearchUnits = (params: UnitPaginationParams) => {
  const query = useQuery<PaginatedResponse<Unit>, Error>({
    queryKey: ["units", "search", params],
    queryFn: () => searchUnits(params),
    placeholderData: keepPreviousData,   // v5
    staleTime: 30_000,
  });

  // ⬇️ Log en cada fetch/refetch exitoso
  useEffect(() => {
    if (query.data) {
      const res = query.data; 
      console.log(
        "[Units fetched]",
        {
          page: res.meta.page,
          limit: res.meta.limit,
          total: res.meta.total,
          pageCount: res.meta.pageCount,
          params,
        },
        res.data 
      );
    }
  }, [query.data, params]);

  return query;
};

export const useDeleteUnitMeasure = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUnitMeasure(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["units"] });
      console.log("Unidad de medida inhabilitada", res);
    },
    onError: (err)=>{
      console.error("Error al inhabilitar", err);
    }
  });
};
