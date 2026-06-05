import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createChangeNameMeterRqAbonado, getMyReqChangeNameMeter, getMyReqChangeNameMeterPaginated, getReqChangeNameMeterById, type MyReqChangeNameMeterParams } from "../../Services/ChangeNameMeter/ChangeNameMterSV";
import type { ReqChangeNameMeter, ReqChangeNameMeterPaginationParams } from "../../../Requests/RequestChangeNameMeter/Models/RequestChangeNameMeter";
import { getAllReqChangeNameMeter, searchReqChangeNameMeter } from "../../../Requests/RequestChangeNameMeter/Services/RequestChangeNameMeter";
import type { PaginatedResponse, PaginationMeta } from "../../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

type LegacyMeta = {
  page?: number;
  limit?: number;
  total?: number;
  pageCount?: number;
};

// Claves de caché estándar (todas las claves derivan de un baseKey sólido)
const baseKey = "reqChangeNameMeter" as const;

const QK = {
  all:        [baseKey] as const,
  list:       (filters?: unknown) => [baseKey, "list", filters ?? {}] as const,               // admin/general
  my:         [baseKey, "me"] as const,                                                      // mis solicitudes (sin paginar)
  myPaginated:(params: MyReqChangeNameMeterParams) => [baseKey, "me", "search", {
                  page: params.page ?? 1,
                  limit: params.limit ?? 10,
                  StateRequestId: params.StateRequestId ?? null,
                  q: params.q?.trim() || null,
                }] as const,
  byId:       (id: number) => [baseKey, "byId", id] as const,
};

// ==== QUERIES ====

// Todas (activas) — uso admin
export function useGetAllReqChangeNameMeter() {
  return useQuery<ReqChangeNameMeter[], Error>({
    queryKey: QK.all,
    queryFn: getAllReqChangeNameMeter,
    staleTime: 30_000,
  });
}

// Búsqueda paginada (admin/general)
export function useSearchReqChangeNameMeter(params: ReqChangeNameMeterPaginationParams) {
  return useQuery<PaginatedResponse<ReqChangeNameMeter>, Error>({
    queryKey: QK.list(params),
    queryFn: () => searchReqChangeNameMeter(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

// Mis solicitudes (no paginado)
export function useGetMyReqChangeNameMeter() {
  return useQuery<ReqChangeNameMeter[], Error>({
    queryKey: QK.my,
    queryFn: getMyReqChangeNameMeter,
    staleTime: 30_000,
  });
}

// Mis solicitudes (paginado) 
export function useGetMyReqChangeNameMeterPaginated(params: MyReqChangeNameMeterParams = {}) {
  const { page = 1, limit = 10, StateRequestId, q } = params;

  const query = useQuery<PaginatedResponse<ReqChangeNameMeter>, Error>({
    queryKey: QK.myPaginated({ page, limit, StateRequestId, q }),
    queryFn: () => getMyReqChangeNameMeterPaginated({ page, limit, StateRequestId, q }),
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
export function useGetReqChangeNameMeterById(id: number) {
  return useQuery<ReqChangeNameMeter, Error>({
    queryKey: QK.byId(id),
    queryFn: () => getReqChangeNameMeterById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

// ==== MUTATIONS ====

export const useChangeNameMeterRq = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createChangeNameMeterRqAbonado,
        onSuccess: async () => {
            await Promise.all([
              qc.invalidateQueries({ queryKey: [baseKey], refetchType: "all" }),
              qc.invalidateQueries({ queryKey: ["request-change-name-meter"], refetchType: "all" }),
            ]);
            toast.success("Solicitud de cambio de nombre de medidor creada con éxito", { position: "top-right", duration: 2000 });
        },
        onError: () => {
            toast.error("Error al crear la solicitud de cambio de nombre de medidor", { position: "top-right", duration: 2000 });
        }
    });
}
