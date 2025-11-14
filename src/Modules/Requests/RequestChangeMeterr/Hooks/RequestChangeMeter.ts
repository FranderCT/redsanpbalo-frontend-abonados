import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReqChangeMeter,
  deleteReqChangeMeter,
  getAllReqChangeMeter,
  getAllRequestStates,
  getReqChangeMeterById,
  searchReqChangeMeter,
  UpdateReqChangeMeter,
  updateCanCommentChangeMeter,
} from "../Services/RequestChangeMeterServices";
import type {
  ReqChangeMeter,
  ReqChangeMeterPaginationParams,
  UpdateReqChangeMeterr,
} from "../Models/RequestChangeMeter";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";

// Listado simple
export const useGetAllReqChangeMeter = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["request-change-meter", "all"],
    queryFn: getAllReqChangeMeter,
    staleTime: 30_000,
  });
  return { reqChangeMeter: data ?? [], isPending, error };
};

// Búsqueda paginada
export const useSearchReqChangeMeter = (params: ReqChangeMeterPaginationParams) => {
  const { page = 1, limit = 10, UserName, StateRequestId, State } = params ?? {};

  const query = useQuery<PaginatedResponse<ReqChangeMeter>, Error>({
    queryKey: [
      "request-change-meter",
      "search",
      page,
      limit,
      UserName ?? "",
      StateRequestId ?? null,
      State ?? "",
    ],
    queryFn: () => searchReqChangeMeter(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  return query;
};

// Detalle
export const useGetReqChangeMeterById = (id?: number) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["request-change-meter", "detail", id],
    queryFn: () => getReqChangeMeterById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
  return { reqChangeMeter: data, isPending, error };
};

// Crear
export const useCreateReqChangeMeter = () => {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: createReqChangeMeter,
    onSuccess: (res) => {
      console.log("Cambio de medidor creado", res);
      // Invalidar todas las queries relacionadas
      qc.invalidateQueries({ queryKey: ['request-change-meter'] });
    },
    onError: (err) => console.error("Error creando cambio de medidor", err),
  });
  return mutation;
};

// Actualizar
export const useUpdateChangeMeter = () => {
  const qc = useQueryClient();
  return useMutation<ReqChangeMeter, Error, { id: number; data: UpdateReqChangeMeterr}>({
    mutationFn: ({ id, data }) =>UpdateReqChangeMeter(id, data),
    onSuccess: (res) => {
      // Invalidar lista, búsquedas y detalle
      qc.invalidateQueries({ queryKey: ["request-change-meter"] });
      qc.invalidateQueries({ queryKey: ["request-change-meter", "detail", res.Id] });
    },
    onError: (err) => console.error("Error actualizando solicitud", err),
  });
};
// Eliminar
export const useDeleteReqChangeMeter = () => {
  const qc = useQueryClient();
  return useMutation<ReqChangeMeter | void, Error, number>({
    mutationFn: (id) => deleteReqChangeMeter(id),
    onSuccess: (res) => {
      console.log("Cambio de medidor eliminado", res);
      // Invalidar todas las queries relacionadas
      qc.invalidateQueries({ queryKey: ["request-change-meter"] });
    },
    onError: (err) => console.error("Error eliminando cambio de medidor", err),
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
};

// Actualizar CanComment
export const useUpdateCanCommentChangeMeter = () => {
  const qc = useQueryClient();
  return useMutation<ReqChangeMeter, Error, { id: number; canComment: boolean }>({
    mutationFn: ({ id, canComment }) => updateCanCommentChangeMeter(id, canComment),
    onSuccess: (res) => {
      console.log("CanComment actualizado", res);
      qc.invalidateQueries({ queryKey: ["request-change-meter"] });
      qc.invalidateQueries({ queryKey: ["request-change-meter", "detail", res.Id] });
    },
    onError: (err) => console.error("Error actualizando CanComment", err),
  });
};