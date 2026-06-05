// Hooks/RequestSupervisionMeterHooks.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import type { PaginatedResponse, PaginationMeta } from "../../../../assets/Dtos/PaginationCategory";
import { createReqSupervisionMeter, deleteReqSupervisionMeter, getAllReqSupervisionMeter, getAllRequestStates, getReqSupervisionMeterById, getReqSupervisionMeterByUser, searchReqSupervisionMeter, updateCanCommentSupervisionMeter, updateReqSupervisionMeter } from "../Services/ReqSupervisionMeterServices";
import type { newReqSupervisionMeter, ReqSupervisionMeter, ReqSupervisionMeterPaginationParams, UpdateReqSupervisionMeter } from "../Models/ReqSupervisionMeter";

type LegacyMeta = {
  page?: number;
  limit?: number;
  total?: number;
  pageCount?: number;
};

// Listado simple
export const useGetAllReqSupervisionMeter = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["request-supervision-meter", "all"],
    queryFn: getAllReqSupervisionMeter,
    staleTime: 30_000,
  });
  return { reqSupervision: data ?? [], isPending, error };
};

// Búsqueda paginada
export const useSearchReqSupervisionMeter = (params: ReqSupervisionMeterPaginationParams) => {
  const {
    page = 1,
    limit = 10,
    UserName,
    StateRequestId,
    NIS,
    State,
  } = params ?? {};

  const query = useQuery<PaginatedResponse<ReqSupervisionMeter>, Error>({
    queryKey: [
      "request-supervision-meter",
      "search",
      page,
      limit,
      UserName ?? "",
      StateRequestId ?? null,
      NIS ?? null,
      State ?? "",
    ],
    queryFn: () => searchReqSupervisionMeter({ page, limit, UserName, StateRequestId, NIS, State }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data) {
      const meta = query.data.meta as PaginationMeta & LegacyMeta;
      console.log("requestsupervision-meter.search query state", {
        source: "admin",
        params: { page, limit, UserName, StateRequestId, NIS, State },
        total: meta.total ?? 0,
        page:  meta.page ?? page,
        limit: meta.limit ?? limit,
        rows: Array.isArray(query.data.data) ? query.data.data.length : 0,
      });
    } else if (query.isFetching) {
      console.log("requestsupervision-meter.search fetching", {
        source: "admin",
        params: { page, limit, UserName, StateRequestId, NIS, State },
      });
    } else if (query.isError) {
      console.error("requestsupervision-meter.search error", {
        source: "admin",
        params: { page, limit, UserName, StateRequestId, NIS, State },
        error: query.error,
      });
    }
  }, [
    query.data,
    query.isFetching,
    query.isError,
    query.error,
    page,
    limit,
    UserName,
    StateRequestId,
    NIS,
    State,
  ]);

  return query;
};

// Detalle por ID
export const useGetReqSupervisionMeterById = (id?: number) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["request-supervision-meter", "detail", id],
    queryFn: () => getReqSupervisionMeterById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
  return { reqSupervision: data, isPending, error };
};

// Crear
export const useCreateReqSupervisionMeter = () => {
  const qc = useQueryClient();
  return useMutation<ReqSupervisionMeter, Error, newReqSupervisionMeter>({
    mutationFn: createReqSupervisionMeter,
    onSuccess: (res) => {
      console.log("Supervisión creada", res);
      qc.invalidateQueries({ queryKey: ["request-supervision-meter"] });
      qc.invalidateQueries({ queryKey: ["reqSupervisionMeter"] });
      qc.invalidateQueries({ queryKey: ["requestsupervision-meter"] });
    },
    onError: (err) => console.error("Error creando supervisión", err),
  });
};

// Actualizar Estado 
export const useUpdateReqSupervisionMeter = () => {
  const qc = useQueryClient();
  return useMutation<ReqSupervisionMeter, Error, { id: number; data: UpdateReqSupervisionMeter }>({
    mutationFn: ({ id, data }) => updateReqSupervisionMeter(id, data),
    onSuccess: (res) => {
      console.log("Supervisión actualizada", res);
      qc.invalidateQueries({ queryKey: ["request-supervision-meter"] });
      qc.invalidateQueries({ queryKey: ["request-supervision-meter", "detail", res.Id] });
    },
    onError: (err) => console.error("Error actualizando supervisión", err),
  });
};

// Actualizar CanComment
export const useUpdateCanCommentSupervisionMeter = () =>{
  const qc = useQueryClient();
  return useMutation<ReqSupervisionMeter,Error,{id:number; CanComment:boolean}>({
    mutationFn:({id,CanComment}) => updateCanCommentSupervisionMeter(id,CanComment),
    onSuccess:(res)=>{
      console.log("CanComment actualizado", res);
      qc.invalidateQueries({ queryKey: ["request-supervision-meter"] });
      qc.invalidateQueries({ queryKey: ["request-supervision-meter", "detail", res.Id] });
    },
    onError:(err) =>console.error("Error actualizando supervisión", err),
  });
}

// Eliminar
export const useDeleteReqSupervisionMeter = () => {
  const qc = useQueryClient();
  return useMutation<ReqSupervisionMeter | void, Error, number>({
    mutationFn: (id) => deleteReqSupervisionMeter(id),
    onSuccess: (res) => {
      console.log("Supervisión eliminada", res);
      qc.invalidateQueries({ queryKey: ["request-supervision-meter"] });
    },
    onError: (err) => console.error("Error eliminando supervisión", err),
  });
};

// Obtener todos los estados de solicitud
export const useGetAllRequestStates = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["request-states", "all"],
    queryFn: () => getAllRequestStates(),
    staleTime: 5 * 60 * 1000, // 5 minutos - datos estáticos
    gcTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
  });
  return { requestStates: data ?? [], isPending, error };
}

export const useGetReqSupervisionMeterByUser = (userId?: number) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["request-supervision-meter", "user", userId],
    queryFn: () => getReqSupervisionMeterByUser(userId as number),
    enabled: typeof userId === "number" && userId > 0,
    staleTime: 30_000,
  });
  return { requests: data ?? [], isLoading, isError, error };
};
