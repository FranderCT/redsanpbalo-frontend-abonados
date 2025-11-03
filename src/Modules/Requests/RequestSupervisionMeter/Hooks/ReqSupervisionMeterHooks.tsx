// Hooks/RequestSupervisionMeterHooks.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import { createReqSupervisionMeter, deleteReqSupervisionMeter, getAllReqSupervisionMeter, getAllRequestStates, getReqSupervisionMeterById, searchReqSupervisionMeter, updateReqSupervisionMeter } from "../Services/ReqSupervisionMeterServices";
import type { newReqSupervisionMeter, ReqSupervisionMeter, ReqSupervisionMeterPaginationParams, UpdateReqSupervisionMeter } from "../Models/ReqSupervisionMeter";

// Listado simple
export const useGetAllReqSupervisionMeter = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["requestsupervision-meter"],
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
      "requestsupervision-meter",
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

  return query;
};

// Detalle por ID
export const useGetReqSupervisionMeterById = (id?: number) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["requestsupervision-meter", id],
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
      qc.invalidateQueries({ queryKey: ["requestsupervision-meter"] });
    },
    onError: (err) => console.error("Error creando supervisión", err),
  });
};

// Actualizar
export const useUpdateReqSupervisionMeter = () => {
  const qc = useQueryClient();
  return useMutation<ReqSupervisionMeter, Error, { id: number; data: UpdateReqSupervisionMeter }>({
    mutationFn: ({ id, data }) => updateReqSupervisionMeter(id, data),
    onSuccess: (res) => {
      console.log("Supervisión actualizada", res);
      qc.invalidateQueries({ queryKey: ["requestsupervision-meter"] });
      qc.invalidateQueries({ queryKey: ["requestsupervision-meter", res.Id] });
    },
    onError: (err) => console.error("Error actualizando supervisión", err),
  });
};

// Eliminar
export const useDeleteReqSupervisionMeter = () => {
  const qc = useQueryClient();
  return useMutation<ReqSupervisionMeter | void, Error, number>({
    mutationFn: (id) => deleteReqSupervisionMeter(id),
    onSuccess: (res) => {
      console.log("Supervisión eliminada", res);
      qc.invalidateQueries({ queryKey: ["requestsupervision-meter"] });
    },
    onError: (err) => console.error("Error eliminando supervisión", err),
  });
};

// Obtener todos los estados de solicitud
export const useGetAllRequestStates = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["request-states"],
    queryFn: () => getAllRequestStates(),
    staleTime: 30_000,
  });
  return { requestStates: data ?? [], isPending, error };
}
