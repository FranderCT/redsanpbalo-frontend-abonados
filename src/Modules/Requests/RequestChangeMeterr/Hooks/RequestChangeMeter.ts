import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReqChangeMeter,
  deleteReqChangeMeter,
  getAllReqChangeMeter,
  getAllRequestStates,
  getReqChangeMeterById,
  searchReqChangeMeter,
  UpdateReqChangeMeter,
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
    queryKey: ["changeMeters"],
    queryFn: getAllReqChangeMeter,
    staleTime: 30_000,
  });
  return { reqChangeMeter: data ?? [], isPending, error };
};

// Búsqueda paginada
export const useSearchReqChangeMeter = (params: ReqChangeMeterPaginationParams) => {
  //const { page = 1, limit = 10, UserName, StateRequestId, State } = params ?? {};

  const query = useQuery<PaginatedResponse<ReqChangeMeter>, Error>({
    queryKey: [
      "changeMeters",
      "search",
      params, // { page, limit, UserName, StateRequestId, State }
    ],
    queryFn: () => searchReqChangeMeter(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
   // refetchOnWindowFocus: false,
  });

  return query;
};

// Detalle
export const useGetReqChangeMeterById = (id?: number) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["changeMeters", id],
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
      qc.invalidateQueries({ queryKey: ['changeMeters','dashboard'] });
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
      qc.invalidateQueries({ queryKey: ["changeMeters"] });
      qc.invalidateQueries({ queryKey: ["changeMeters", res.Id] });
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
      qc.invalidateQueries({ queryKey: ["changeMeters"] });
    },
    onError: (err) => console.error("Error eliminando cambio de medidor", err),
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