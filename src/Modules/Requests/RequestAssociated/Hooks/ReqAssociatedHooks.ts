// Hooks/RequestAssociatedHooks.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRequestAssociated, deleteRequestAssociated, getAllRequestAssociated, getAllRequestStates, getReqAssociatedFolderLink, getRequestAssociatedById, searchRequestAssociated, UpdateAssociatedReq} from "../Services/ReqAssociatedServices";
import type { newReqAssociated, ReqAssociated, ReqAssociatedPaginationParams, ReqAssociatedResponse, UpdateReqAssociated } from "../Models/RequestAssociated";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";


// Listado simple
export const useGetAllRequestAssociated = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["request-associated", "all"],
    queryFn: getAllRequestAssociated,
    staleTime: 30_000,
  });
  return { requestAssociated: data ?? [], isPending, error };
};

// Búsqueda paginada
export const useSearchRequestAssociated = (params: ReqAssociatedPaginationParams) => {
  const { page = 1, limit = 10, UserName, StateRequestId, State } = params ?? {};

  const query = useQuery<PaginatedResponse<ReqAssociated>, Error>({
    queryKey: [
      "request-associated",
      "search",
      page,
      limit,
      UserName ?? "",
      StateRequestId ?? null,
      State ?? "",
    ],
    queryFn: () => searchRequestAssociated({ page, limit, UserName, StateRequestId, State }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  return query;
};

// Detalle por ID
export const useGetRequestAssociatedById = (id?: number) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["request-associated", "detail", id],
    queryFn: () => getRequestAssociatedById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
  return { requestAssociated: data, isPending, error };
};

// Crear
export const useCreateRequestAssociated = () => {
  const qc = useQueryClient();
  return useMutation<ReqAssociated, Error, newReqAssociated>({
    mutationFn: createRequestAssociated,
    onSuccess: (res) => {
      console.log("Asociado creado", res);
      qc.invalidateQueries({ queryKey: ["request-associated"] });
    },
    onError: (err) => console.error("Error creando asociado", err),
  });
};

// Actualizar
export const useUpdateAssociatedreq = () => {
  const qc = useQueryClient();
  return useMutation<ReqAssociated, Error, { id: number; data:UpdateReqAssociated }>({
    mutationFn: ({ id, data }) =>UpdateAssociatedReq(id, data),
    onSuccess: (res) => {
      console.log("Estado de asociado actualizada", res);
      // Invalidar lista, búsquedas y detalle
      qc.invalidateQueries({ queryKey: ["request-associated"] });
      qc.invalidateQueries({ queryKey: ["request-associated", "detail", res.Id] });
    },
    onError: (err) => console.error("Error actualizando estado de asociado", err),
  });
};
// Eliminar
export const useDeleteRequestAssociated = () => {
  const qc = useQueryClient();
  return useMutation<ReqAssociated | void, Error, number>({
    mutationFn: (id) => deleteRequestAssociated(id),
    onSuccess: (res) => {
      console.log("Asociado eliminado", res);
      // Invalidar todas las queries relacionadas
      qc.invalidateQueries({ queryKey: ["request-associated"] });
    },
    onError: (err) => console.error("Error eliminando asociado", err),
  });
};

// Obtener todos los estados de solicitud - Usar el hook centralizado del módulo StateRequest
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


export function useReqAssociatedFolderLink() {
  return useMutation<ReqAssociatedResponse, Error, number>({
    mutationFn: (id: number) => getReqAssociatedFolderLink(id),
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