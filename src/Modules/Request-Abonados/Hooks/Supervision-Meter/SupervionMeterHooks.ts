import { useQueryClient, useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import { createSupervisionMeterRequest, getMyReqSupervisionMeter, getMyReqSupervisionMeterPaginated, getReqSupervisionMeterById, type MyReqSupervisionMeterParams } from "../../Services/Supervision-Meter/SupervisionMeterSV";
import { toast } from "sonner";
import type { ReqSupervisionMeter, ReqSupervisionMeterPaginationParams } from "../../../Requests/RequestSupervisionMeter/Models/ReqSupervisionMeter";
import { getAllReqSupervisionMeter, searchReqSupervisionMeter } from "../../../Requests/RequestSupervisionMeter/Services/ReqSupervisionMeterServices";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

// Claves de caché estándar (todas las claves derivan de un baseKey sólido)
const baseKey = "reqSupervisionMeter" as const;

const QK = {
  all:        [baseKey] as const,
  list:       (filters?: unknown) => [baseKey, "list", filters ?? {}] as const,               // admin/general
  my:         [baseKey, "me"] as const,                                                      // mis solicitudes (sin paginar)
  myPaginated:(params: MyReqSupervisionMeterParams) => [baseKey, "me", "search", {
                  page: params.page ?? 1,
                  limit: params.limit ?? 10,
                  StateRequestId: params.StateRequestId ?? null,
                  q: params.q?.trim() || null,
                }] as const,
  byId:       (id: number) => [baseKey, "byId", id] as const,
};

// ==== QUERIES ====

// Todas (activas) — uso admin
export function useGetAllReqSupervisionMeter() {
  return useQuery<ReqSupervisionMeter[], Error>({
    queryKey: QK.all,
    queryFn: getAllReqSupervisionMeter,
    staleTime: 30_000,
  });
}

// Búsqueda paginada (admin/general)
export function useSearchReqSupervisionMeter(params: ReqSupervisionMeterPaginationParams) {
  return useQuery<PaginatedResponse<ReqSupervisionMeter>, Error>({
    queryKey: QK.list(params),
    queryFn: () => searchReqSupervisionMeter(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

// Mis solicitudes (no paginado)
export function useGetMyReqSupervisionMeter() {
  return useQuery<ReqSupervisionMeter[], Error>({
    queryKey: QK.my,
    queryFn: getMyReqSupervisionMeter,
    staleTime: 30_000,
  });
}

// Mis solicitudes (paginado) 
export function useGetMyReqSupervisionMeterPaginated(params: MyReqSupervisionMeterParams = {}) {
  const { page = 1, limit = 10, StateRequestId, q } = params;

  const query = useQuery<PaginatedResponse<ReqSupervisionMeter>, Error>({
    queryKey: QK.myPaginated({ page, limit, StateRequestId, q }),
    queryFn: () => getMyReqSupervisionMeterPaginated({ page, limit, StateRequestId, q }),
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
export function useGetReqSupervisionMeterById(id: number) {
  return useQuery<ReqSupervisionMeter, Error>({
    queryKey: QK.byId(id),
    queryFn: () => getReqSupervisionMeterById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

// ==== MUTATIONS ====


export const useCreateSupervisionMeterRequest = () => {
    // definimos el hook para crear una solicitud de supervisión de medidor
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createSupervisionMeterRequest,
        mutationKey: ['requestsupervision-meter'],
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['requestsupervision-meter'] });
            toast.success('Solicitud de supervisión de medidor creada con éxito', {position: "top-right", duration: 2000});
        }, onError: (error: any) => {
            toast.error(`Error al crear la solicitud: ${error.message}`, {position: "top-right", duration: 2000});
        }
    });
}