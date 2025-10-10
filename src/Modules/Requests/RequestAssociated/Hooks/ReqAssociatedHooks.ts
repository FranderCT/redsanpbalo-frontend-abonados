// Hooks/RequestAssociatedHooks.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRequestAssociated, deleteRequestAssociated, getAllRequestAssociated, getRequestAssociatedById, searchRequestAssociated, updateRequestAssociated } from "../Services/ReqAssociatedServices";
import type { newReqAssociated, ReqAssociated, ReqAssociatedPaginationParams, UpdateReqAssociated } from "../Models/RequestAssociated";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";


// Listado simple
export const useGetAllRequestAssociated = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["request-associated"],
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
    queryKey: ["request-associated", id],
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
export const useUpdateRequestAssociated = () => {
  const qc = useQueryClient();
  return useMutation<ReqAssociated, Error, { id: number; data: UpdateReqAssociated }>({
    mutationFn: ({ id, data }) => updateRequestAssociated(id, data),
    onSuccess: (res) => {
      console.log("Asociado actualizado", res);
      qc.invalidateQueries({ queryKey: ["request-associated"] });
      qc.invalidateQueries({ queryKey: ["request-associated", res.Id] });
    },
    onError: (err) => console.error("Error actualizando asociado", err),
  });
};

// Eliminar
export const useDeleteRequestAssociated = () => {
  const qc = useQueryClient();
  return useMutation<ReqAssociated | void, Error, number>({
    mutationFn: (id) => deleteRequestAssociated(id),
    onSuccess: (res) => {
      console.log("Asociado eliminado", res);
      qc.invalidateQueries({ queryKey: ["request-associated"] });
    },
    onError: (err) => console.error("Error eliminando asociado", err),
  });
};
