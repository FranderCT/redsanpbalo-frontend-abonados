import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createChangeMeterRequest, getMyReqChangeMeter, getMyReqChangeMeterPaginated, getReqChangeMeterById, type MyReqChangeMeterParams } from "../../Services/Change-Meter/ChangeMeterSV";
import { toast } from "react-toastify";
import type { ReqChangeMeter, ReqChangeMeterPaginationParams } from "../../../Requests/RequestChangeMeterr/Models/RequestChangeMeter";
import { getAllReqChangeMeter, searchReqChangeMeter } from "../../../Requests/RequestChangeMeterr/Services/RequestChangeMeterServices";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

// Claves de caché estándar (todas las claves derivan de un baseKey sólido)
const baseKey = "reqChangeMeter" as const;

const QK = {
  all:        [baseKey] as const,
  list:       (filters?: unknown) => [baseKey, "list", filters ?? {}] as const,               // admin/general
  my:         [baseKey, "me"] as const,                                                      // mis solicitudes (sin paginar)
  myPaginated:(params: MyReqChangeMeterParams) => [baseKey, "me", "search", {
                  page: params.page ?? 1,
                  limit: params.limit ?? 10,
                  StateRequestId: params.StateRequestId ?? null,
                  q: params.q?.trim() || null,
                }] as const,
  byId:       (id: number) => [baseKey, "byId", id] as const,
};

// ==== QUERIES ====

// Todas (activas) — uso admin
export function useGetAllReqChangeMeter() {
  return useQuery<ReqChangeMeter[], Error>({
    queryKey: QK.all,
    queryFn: getAllReqChangeMeter,
    staleTime: 30_000,
  });
}

// Búsqueda paginada (admin/general)
export function useSearchReqAvailWater(params: ReqChangeMeterPaginationParams) {
  return useQuery<PaginatedResponse<ReqChangeMeter>, Error>({
    queryKey: QK.list(params),
    queryFn: () => searchReqChangeMeter(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

// Mis solicitudes (no paginado)
export function useGetMyReqChangeMeter() {
  return useQuery<ReqChangeMeter[], Error>({
    queryKey: QK.my,
    queryFn: getMyReqChangeMeter,
    staleTime: 30_000,
  });
}

// Mis solicitudes (paginado) 
export function useGetMyReqChangeMeterPaginated(params: MyReqChangeMeterParams = {}) {
  const { page = 1, limit = 10, StateRequestId, q } = params;

  const query = useQuery<PaginatedResponse<ReqChangeMeter>, Error>({
    queryKey: QK.myPaginated({ page, limit, StateRequestId, q }),
    queryFn: () => getMyReqChangeMeterPaginated({ page, limit, StateRequestId, q }),
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
export function useGetReqChangeMeterById(id: number) {
  return useQuery<ReqChangeMeter, Error>({
    queryKey: QK.byId(id),
    queryFn: () => getReqChangeMeterById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

// ==== MUTATIONS ====

export const useCreateChangeMeterRequest = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createChangeMeterRequest,
        mutationKey: ['changeMeters'],
            // refresca listas donde corresponda
        onSuccess: () => {
            // refresca listas donde corresponda
            qc.invalidateQueries({ queryKey: ["changeMeters"] });
            toast.success('Solicitud de cambio de medidor creada con éxito', {position: "top-right", autoClose: 2000});
        },
        onError: (error: any) => {
            toast.error(`Error al crear la solicitud: ${error.message}`, {position: "top-right", autoClose: 2000});
        }
    });
}
