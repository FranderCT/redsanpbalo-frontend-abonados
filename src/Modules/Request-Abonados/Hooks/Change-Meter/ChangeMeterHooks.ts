import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createChangeMeterRequest, getMyReqChangeMeter, getMyReqChangeMeterPaginated, getReqChangeMeterById, type MyReqChangeMeterParams } from "../../Services/Change-Meter/ChangeMeterSV";
import { toast } from "sonner";
import type { ReqChangeMeter, ReqChangeMeterPaginationParams } from "../../../Requests/RequestChangeMeterr/Models/RequestChangeMeter";
import { getAllReqChangeMeter, searchReqChangeMeter } from "../../../Requests/RequestChangeMeterr/Services/RequestChangeMeterServices";
import type { PaginatedResponse, PaginationMeta } from "../../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

type LegacyMeta = {
  page?: number;
  limit?: number;
  total?: number;
  pageCount?: number;
};

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

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Error al crear la solicitud";

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
export function useSearchReqChangeMeter(params: ReqChangeMeterPaginationParams) {
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

  useEffect(() => {
    if (query.data) {
      const res = query.data;
      const meta = res.meta as PaginationMeta & LegacyMeta;
      console.log(
        "[ASADA API] Mis solicitudes recibidas",
        {
          page: meta.page,
          limit: meta.limit,
          total: meta.total,
          pageCount: meta.pageCount,
          params: { page, limit, StateRequestId, q },
        },
        res.data
      );
    } else if (query.isFetching) {
      console.log("[ASADA API] Cargando solicitudes...", {
        params: { page, limit, StateRequestId, q },
      });
    } else if (query.isError) {
      console.error("[ASADA API] Error al conectar con el backend:", query.error);
    }
  }, [query.data, query.isFetching, query.isError, query.error, page, limit, StateRequestId, q]);

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
            qc.invalidateQueries({ queryKey: ["changeMeters"] });
            qc.invalidateQueries({ queryKey: ["reqChangeMeter"] });
            qc.invalidateQueries({ queryKey: ["request-change-meter"] });
            toast.success('Solicitud de cambio de medidor creada con éxito', {position: "top-right", duration: 2000});
        },
        onError: (error) => {
            toast.error(`Error al crear la solicitud: ${getErrorMessage(error)}`, {position: "top-right", duration: 2000});
        }
    });
}
