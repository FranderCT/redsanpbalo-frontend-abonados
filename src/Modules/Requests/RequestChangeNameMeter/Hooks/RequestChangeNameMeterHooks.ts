import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  ReqChangeNameMeter,
  newReqChangeNameMeter,
  ReqChangeNameMeterPaginationParams,
  UpdateReqChangeNameMeter,
  ReqChangeNameLinkResponse,
} from "../Models/RequestChangeNameMeter";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import { createReqChangeNameMeter, deleteReqChangeNameMeter, getAllReqChangeNameMeter, getAllRequestStates, getReqChangeNameFolderLink, getReqChangeNameMeterById, getReqChangeNameMeterByUser, searchReqChangeNameMeter, updateReqChangeNameMeter, updateCanCommentChangeNameMeter } from "../Services/RequestChangeNameMeter";

// Listado simple
export const useGetAllReqChangeNameMeter = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["request-change-name-meter", "all"],
    queryFn: getAllReqChangeNameMeter,
    staleTime: 30_000,
  });
  return { reqChangeNameMeter: data ?? [], isPending, error };
};

// Búsqueda paginada
export const useSearchReqChangeNameMeter = (params: ReqChangeNameMeterPaginationParams) => {
  const { page = 1, limit = 10, UserName, StateRequestId, State } = params ?? {};

  const query = useQuery<PaginatedResponse<ReqChangeNameMeter>, Error>({
    queryKey: [
      "request-change-name-meter",
      "search",
      page,
      limit,
      UserName ?? "",
      StateRequestId ?? null,
      State ?? "",
    ],
    queryFn: () => searchReqChangeNameMeter({ page, limit, UserName, StateRequestId, State }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  return query;
};

// Detalle por ID
export const useGetReqChangeNameMeterById = (id?: number) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["request-change-name-meter", "detail", id],
    queryFn: () => getReqChangeNameMeterById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
  return { reqChangeNameMeter: data, isPending, error };
};

// Crear
export const useCreateReqChangeNameMeter = () => {
  const qc = useQueryClient();
  return useMutation<ReqChangeNameMeter, Error, newReqChangeNameMeter>({
    mutationFn: createReqChangeNameMeter,
    onSuccess: (res) => {
      console.log("Cambio de nombre de medidor creado", res);
      qc.invalidateQueries({ queryKey: ["request-change-name-meter"] });
    },
    onError: (err) => console.error("Error creando cambio de nombre de medidor", err),
  });
};

//Actualizar
export const useUpdateReqChangeNameMeter = () => {
  const qc = useQueryClient();
  return useMutation<ReqChangeNameMeter, Error, { id: number; data: UpdateReqChangeNameMeter }>({
    mutationFn: ({ id, data }) => updateReqChangeNameMeter(id, data),
    onSuccess: (res) => {
      console.log("Cambio de nombre de medidor actualizado", res);
      // Invalidar lista, búsquedas y detalle
      qc.invalidateQueries({ queryKey: ["request-change-name-meter"] });
      qc.invalidateQueries({ queryKey: ["request-change-name-meter", "detail", res.Id] });
    },
    onError: (err) => console.error("Error actualizando cambio de nombre de medidor", err),
  });
};

// Eliminar
export const useDeleteReqChangeNameMeter = () => {
  const qc = useQueryClient();
  return useMutation<ReqChangeNameMeter | void, Error, number>({
    mutationFn: (id) => deleteReqChangeNameMeter(id),
    onSuccess: (res) => {
      console.log("Cambio de nombre de medidor eliminado", res);
      // Invalidar todas las queries relacionadas
      qc.invalidateQueries({ queryKey: ["request-change-name-meter"] });
    },
    onError: (err) => console.error("Error eliminando cambio de nombre de medidor", err),
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

export function useReqChangeNameFolderLink() {
  return useMutation<ReqChangeNameLinkResponse, Error, number>({
    mutationFn: (id: number) => getReqChangeNameFolderLink(id),
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
export const useUpdateCanCommentChangeNameMeter = () => {
  const qc = useQueryClient();
  return useMutation<ReqChangeNameMeter, Error, { id: number; canComment: boolean }>({
    mutationFn: ({ id, canComment }) => updateCanCommentChangeNameMeter(id, canComment),
    onSuccess: (res) => {
      console.log("CanComment actualizado", res);
      qc.invalidateQueries({ queryKey: ["request-change-name-meter"] });
      qc.invalidateQueries({ queryKey: ["request-change-name-meter", "detail", res.Id] });
    },
    onError: (err) => console.error("Error actualizando CanComment", err),
  });
};


export const useGetReqChangeNameMeterByUser = (userId?: number) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["request-change-name-meter", "user", userId],
    queryFn: () => getReqChangeNameMeterByUser(userId as number),
    enabled: typeof userId === "number" && userId > 0,
    staleTime: 30_000,
  });
  return { requests: data ?? [], isLoading, isError, error };
};
