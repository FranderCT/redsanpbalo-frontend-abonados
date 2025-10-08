// Hooks/MaterialHooks.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createReqAvailWater, deleteReqAvailWater, getAllReqAvailWater, getReqAvailWaterById, searchReqAvailWater, updateReqAvailWater } from "../Services/ReqAvilWaterServices";
import type { ReqAvailWater, ReqAvailWaterPaginationParams, UpdateReqAvailWater } from "../Models/ReqAvailWater";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";

// Obtener todos
export const useGetAllReqAvailWater = () => {
  const { data: reqavailwater, isPending, error } = useQuery({
    queryKey: ["reqavailwater"],
    queryFn: getAllReqAvailWater,
  });
  return { reqavailwater, isPending, error };
};

// export const useGetProjectCard = () => {
//     const {data: ProjectCard, isLoading, error} = useQuery({
//         queryKey: ['projectCard'],
//         queryFn: () => getProjectCard()
//     });

//     return { ProjectCard, isLoading, error };
// }

// --- hook (misma estructura, con useEffect para el log) ---
export const useSearchReqAvailWater = (params: ReqAvailWaterPaginationParams) => {
  const {
    page = 1,
    limit = 10,
    UserName,
    State,
    StateRequestId,
  } = params ?? {};

  const query = useQuery<PaginatedResponse<ReqAvailWater>, Error>({
    // 👇 La clave incluye los filtros como PRIMITIVOS
    queryKey: [
      "reqavailwater", "search",
      page,
      limit,
      UserName ?? "",
      State ?? "",
      StateRequestId ?? null,
    ],
    queryFn: () => searchReqAvailWater({ page, limit, UserName, State, StateRequestId }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,   // opcional
  });

  useEffect(() => {
    if (query.data) {
      const res = query.data;
      console.log(
        "[Requests fetched]",
        {
          page: res.meta.page,
          limit: res.meta.limit,
          total: res.meta.total,
          pageCount: res.meta.pageCount,
          params: { page, limit, UserName, State, StateRequestId },
        },
        res.data
      );
    }
  }, [query.data, page, limit, UserName, State, StateRequestId]);

  return query;
};



// Obtener por ID
export const useGetReqAvailWaterById = (id?: number) => {
  const { data: reqavailwater, isPending, error } = useQuery({
    queryKey: ["reqavailwater", id],
    queryFn: () => getReqAvailWaterById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
  return { reqavailwater, isPending, error };
};

// Crear
export const useCreateReqAvailWater = () => {
  const qc = useQueryClient();
  const mutation = useMutation({
      mutationFn: createReqAvailWater,
      onSuccess: (res) =>{
          console.log('Solicitud creada correctamente',res)
          qc.invalidateQueries({queryKey: ['reqavailwater']})
      },
      onError: (err) =>{
          console.error('Error al crear', err)
      }
  })

  return mutation;
};

// Actualizar
 export const useUpdateReqAvailWater = () => {
   const qc = useQueryClient();
  
   const mutation = useMutation<ReqAvailWater, Error, {id: number; data: UpdateReqAvailWater }>({
       mutationFn: ({id, data}) => updateReqAvailWater(id, data),
       onSuccess :(res)=>{
           console.log('Solicitud Actualizada', console.log(res))
           qc.invalidateQueries({queryKey: [`reqavailwater`]})
       },
       onError: (err) =>{
           console.error(err);
       }
   })

   return mutation;
 };

// Eliminar
export const useDeleteReqAvailWater = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteReqAvailWater(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["reqavailwater"] });
      console.log("Solicitud inhabilitada", res);
    },
    onError: (err)=>{
      console.error("Error al inhabilitar", err);
    }
  });
};
