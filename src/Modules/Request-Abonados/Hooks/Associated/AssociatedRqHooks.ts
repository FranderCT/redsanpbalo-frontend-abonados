import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAssociatedRequest, getMyReqAssociated, getMyReqAssociatedPaginated, getReqAssociatedById, type MyReqAssociatedParams } from "../../Services/Associated/AssociatedSV";
import { toast } from "react-toastify";
import type { ReqAssociated, ReqAssociatedPaginationParams } from "../../../Requests/RequestAssociated/Models/RequestAssociated";
import { getAllRequestAssociated, searchRequestAssociated } from "../../../Requests/RequestAssociated/Services/ReqAssociatedServices";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

// Claves de caché estándar (todas las claves derivan de un baseKey sólido)
const baseKey = "reqAssociated" as const;

const QK = {
  all:        [baseKey] as const,
  list:       (filters?: unknown) => [baseKey, "list", filters ?? {}] as const,               // admin/general
  my:         [baseKey, "me"] as const,                                                      // mis solicitudes (sin paginar)
  myPaginated:(params: MyReqAssociatedParams) => [baseKey, "me", "search", {
                  page: params.page ?? 1,
                  limit: params.limit ?? 10,
                  StateRequestId: params.StateRequestId ?? null,
                  q: params.q?.trim() || null,
                }] as const,
  byId:       (id: number) => [baseKey, "byId", id] as const,
};

// ==== QUERIES ====

// Todas (activas) — uso admin
export function useGetAllReqAssociated() {
  return useQuery<ReqAssociated[], Error>({
    queryKey: QK.all,
    queryFn: getAllRequestAssociated,
    staleTime: 30_000,
  });
}

// Búsqueda paginada (admin/general)
export function useSearchReqAssociated(params: ReqAssociatedPaginationParams) {
  return useQuery<PaginatedResponse<ReqAssociated>, Error>({
    queryKey: QK.list(params),
    queryFn: () => searchRequestAssociated(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

// Mis solicitudes (no paginado)
export function useGetMyReqAssociated() {
  return useQuery<ReqAssociated[], Error>({
    queryKey: QK.my,
    queryFn: getMyReqAssociated,
    staleTime: 30_000,
  });
}

// Mis solicitudes (paginado) 
export function useGetMyReqAssociatedPaginated(params: MyReqAssociatedParams = {}) {
  const { page = 1, limit = 10, StateRequestId, q } = params;

  const query = useQuery<PaginatedResponse<ReqAssociated>, Error>({
    queryKey: QK.myPaginated({ page, limit, StateRequestId, q }),
    queryFn: () => getMyReqAssociatedPaginated({ page, limit, StateRequestId, q }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  // 🧩 Log de depuración — confirma que el backend está respondiendo
  useEffect(() => {
    if (query.data) {
      const res = query.data;
      console.log(
        "%c[ASADA API] 🔵 Mis solicitudes recibidas",
        "color: #3DA9FC; font-weight: bold;",
        {
          page: res.meta.page,
          limit: res.meta.limit,
          total: res.meta.total,
          pageCount: res.meta.pageCount,
          params: { page, limit, StateRequestId, q },
        },
        res.data
      );
    } else if (query.isFetching) {
      console.log(
        "%c[ASADA API] 🟡 Cargando solicitudes...",
        "color: #EFB700; font-weight: bold;",
        { params: { page, limit, StateRequestId, q } }
      );
    } else if (query.isError) {
      console.error(
        "[ASADA API] 🔴 Error al conectar con el backend:",
        query.error
      );
    }
  }, [query.data, query.isFetching, query.isError, page, limit, StateRequestId, q]);

  return query;
}

// Por Id
export function useGetReqAssociatedById(id: number) {
  return useQuery<ReqAssociated, Error>({
    queryKey: QK.byId(id),
    queryFn: () => getReqAssociatedById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

// ==== MUTATIONS ====

export const useCreateAssociatedRequest = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn:  createAssociatedRequest,
        mutationKey: ['associated', 'create'],
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['associated'] });
            toast.success("Solicitud de asociado creada con éxito", {position: "top-right", autoClose: 3000});
        },
        onError: (error) => {
            console.error("Error creating associated request:", error);
            toast.error("Error al crear la solicitud de asociado", {position: "top-right", autoClose: 3000});
        }
    }); 
}