// Hooks
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  createAvailabilityWaterRq,
  getMyReqAvailWater,
  getMyReqAvailWaterPaginated,
  getReqAvailWaterById,
  type MyReqAvailWaterParams
} from "../../Services/AvailabilityWater/AvailabilityWaterSV";
import { toast } from "sonner";
import type { ReqAvailWater, ReqAvailWaterPaginationParams } from "../../../Requests/RequestAvailabilityWater/Models/ReqAvailWater";
import { getAllReqAvailWater, searchReqAvailWater } from "../../../Requests/RequestAvailabilityWater/Services/ReqAvilWaterServices";
import type { PaginatedResponse, PaginationMeta } from "../../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

type LegacyMeta = {
  page?: number;
  limit?: number;
  total?: number;
  pageCount?: number;
};


// Claves de caché estándar (todas las claves derivan de un baseKey sólido)
const baseKey = "reqAvailWater" as const;

const QK = {
  all:        [baseKey] as const,
  list:       (filters?: unknown) => [baseKey, "list", filters ?? {}] as const,               // admin/general
  my:         [baseKey, "me"] as const,                                                      // mis solicitudes (sin paginar)
  myPaginated:(params: MyReqAvailWaterParams) => [baseKey, "me", "search", {
                  page: params.page ?? 1,
                  limit: params.limit ?? 10,
                  StateRequestId: params.StateRequestId ?? null,
                  q: params.q?.trim() || null,
                }] as const,
  byId:       (id: number) => [baseKey, "byId", id] as const,
};

// ==== QUERIES ====

// Todas (activas) — uso admin
export function useGetAllReqAvailWater() {
  return useQuery<ReqAvailWater[], Error>({
    queryKey: QK.all,
    queryFn: getAllReqAvailWater,
    staleTime: 30_000,
  });
}

// Búsqueda paginada (admin/general)
export function useSearchReqAvailWater(params: ReqAvailWaterPaginationParams) {
  return useQuery<PaginatedResponse<ReqAvailWater>, Error>({
    queryKey: QK.list(params),
    queryFn: () => searchReqAvailWater(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

// Mis solicitudes (no paginado)
export function useGetMyReqAvailWater() {
  return useQuery<ReqAvailWater[], Error>({
    queryKey: QK.my,
    queryFn: getMyReqAvailWater,
    staleTime: 30_000,
  });
}

// Mis solicitudes (paginado) 
export function useGetMyReqAvailWaterPaginated(params: MyReqAvailWaterParams = {}) {
  const { page = 1, limit = 10, StateRequestId, q } = params;

  const query = useQuery<PaginatedResponse<ReqAvailWater>, Error>({
    queryKey: QK.myPaginated({ page, limit, StateRequestId, q }),
    queryFn: () => getMyReqAvailWaterPaginated({ page, limit, StateRequestId, q }),
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
          page: meta.currentPage ?? meta.page,
          limit: meta.itemsPerPage ?? meta.limit,
          total: meta.totalItems ?? meta.total,
          pageCount: meta.totalPages ?? meta.pageCount,
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
export function useGetReqAvailWaterById(id: number) {
  return useQuery<ReqAvailWater, Error>({
    queryKey: QK.byId(id),
    queryFn: () => getReqAvailWaterById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

// ==== MUTATIONS ====

export function useCreateAvailabilityWaterRq() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createAvailabilityWaterRq,
    onSuccess: () => {
      // Invalida lo que vea el usuario inmediatamente relevante:
      qc.invalidateQueries({ queryKey: QK.my }); // lista sin paginar
      qc.invalidateQueries({ queryKey: [baseKey, "me", "search"] }); // cualquier paginado
      // (Opcional) admin:
      qc.invalidateQueries({ queryKey: QK.all });
      qc.invalidateQueries({ queryKey: [baseKey, "list"] });
      qc.invalidateQueries({ queryKey: ["request-availability-water"] });

      toast.success("Solicitud de disponibilidad de agua creada con éxito", { position: "top-right", duration: 2000 });
    },
    onError: () => {
      toast.error("Error al crear la solicitud de disponibilidad de agua", { position: "top-right", duration: 2000 });
    }
  });
}

