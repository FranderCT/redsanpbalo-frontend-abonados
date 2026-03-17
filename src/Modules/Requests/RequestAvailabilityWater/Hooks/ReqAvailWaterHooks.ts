import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReqAvailWater, deleteReqAvailWater, getAllReqAvailWater, getAllRequestStates, getReqAvailWaterById, getReqAvailWaterFolderLink, searchReqAvailWater, UpdateReqAvailWater, updateCanCommentAvailWater } from "../Services/ReqAvilWaterServices";
import type { ReqAvailWater, ReqAvailWaterPaginationParams, ReqWaterLinkResponse, UpdateReqAvailabilityWater} from "../Models/ReqAvailWater";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

type LegacyMeta = {
  page?: number;
  limit?: number;
  total?: number;
  pageCount?: number;
};


// Obtener todos
export const useGetAllReqAvailWater = () => {
  const { data: reqavailwater, isPending, error } = useQuery({
    queryKey: ["request-availability-water", "all"],
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
    q,
    State,
    StateRequestId,
  } = params ?? {};

  const query = useQuery<PaginatedResponse<ReqAvailWater>, Error>({
  
    queryKey: [
      "request-availability-water",
      "search",
      page,
      limit,
      q ?? "",
      State ?? "",
      StateRequestId ?? null,
    ],
    queryFn: () => searchReqAvailWater({ page, limit, q, State, StateRequestId }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,   // opcional
  });

  useEffect(() => {
    if (query.data) {
      const res = query.data;
      const rawMeta = res.meta as typeof res.meta & LegacyMeta;
      console.log(
        "[Requests fetched]",
        {
          page: rawMeta.currentPage ?? rawMeta.page ?? page,
          limit: rawMeta.itemsPerPage ?? rawMeta.limit ?? limit,
          total: rawMeta.totalItems ?? rawMeta.total ?? res.data.length,
          pageCount: rawMeta.totalPages ?? rawMeta.pageCount ?? 1,
          params: { page, limit, q, State, StateRequestId },
        },
        res.data
      );
    }
  }, [query.data, page, limit, q, State, StateRequestId]);

  return query;
};



// Obtener por ID
export const useGetReqAvailWaterById = (id?: number) => {
  const { data: reqavailwater, isPending, error } = useQuery({
    queryKey: ["request-availability-water", "detail", id],
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
          // Invalidar todas las queries relacionadas
          qc.invalidateQueries({queryKey: ['request-availability-water']})
      },
      onError: (err) =>{
          console.error('Error al crear', err)
      }
  })

  return mutation;
};

// Actualizar
export const useUpdateAvailabilityWater = () => {
  const qc = useQueryClient();
  return useMutation<ReqAvailWater, Error, { id: number; data: UpdateReqAvailabilityWater }>({
    mutationFn: ({ id, data }) =>UpdateReqAvailWater(id, data),
    onSuccess: (res) => {
      console.log("Estado de solicitud actualizada", res);
      // Invalidar lista general, búsquedas y detalle específico
      qc.invalidateQueries({ queryKey: ["request-availability-water"] });
      qc.invalidateQueries({ queryKey: ["request-availability-water", "detail", res.Id] });
    },
    onError: (err) => console.error("Error actualizando solicitud", err),
  });
};

// Eliminar
export const useDeleteReqAvailWater = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteReqAvailWater(id),
    onSuccess: (res) => {
      // Invalidar todas las queries relacionadas
      qc.invalidateQueries({ queryKey: ["request-availability-water"] });
      console.log("Solicitud inhabilitada", res);
    },
    onError: (err)=>{
      console.error("Error al inhabilitar", err);
    }
  });
};

// Obtener todos los estados de solicitud
export const useGetAllRequestStates = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["request-states", "all"],
    queryFn: () => getAllRequestStates(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
  });
  return { requestStates: data ?? [], isPending, error };
}


export function useReqAvailWaterFolderLink() {
  return useMutation<ReqWaterLinkResponse, Error, number>({
    mutationFn: (id: number) => getReqAvailWaterFolderLink(id),
    onSuccess: (data) => {
      let urlToOpen = null
      if (typeof data === 'string') {
        urlToOpen = data;
      } else if (data?.link) {
        urlToOpen = data.link;
      } else if (data?.url) {
        urlToOpen = data.url;
      }
      console.log('🔗 URL a abrir:', urlToOpen);
      
      if (urlToOpen) {
        window.open(urlToOpen, "_blank", "noopener,noreferrer");
      } else {
        console.error('No se encontró un link válido en la respuesta:', data);
        alert("No se pudo obtener el link de la carpeta de Dropbox");
      }
    },
    onError: (error) => {
      console.error("Error al obtener el link de Dropbox:", error);
      alert("Error al abrir la carpeta de Dropbox. Por favor, intenta de nuevo.");
    },
  });
}

// Actualizar CanComment
export const useUpdateCanCommentAvailWater = () => {
  const qc = useQueryClient();
  return useMutation<ReqAvailWater, Error, { id: number; canComment: boolean }>({
    mutationFn: ({ id, canComment }) => updateCanCommentAvailWater(id, canComment),
    onSuccess: (res) => {
      console.log("CanComment actualizado", res);
      qc.invalidateQueries({ queryKey: ["request-availability-water"] });
      qc.invalidateQueries({ queryKey: ["request-availability-water", "detail", res.Id] });
    },
    onError: (err) => console.error("Error actualizando CanComment", err),
  });
};
