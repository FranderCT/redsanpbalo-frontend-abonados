import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createChangeMeterRequest } from "../../Services/Change-Meter/ChangeMeterSV";
import { createChangeNameMeterRqAbonado, getMyReqChangeNameMeter, getMyReqChangeNameMeterPaginated, getReqChangeNameMeterById, type MyReqChangeNameMeterParams } from "../../Services/ChangeNameMeter/ChangeNameMterSV";
import type { ReqChangeNameMeter, ReqChangeNameMeterPaginationParams } from "../../../Requests/RequestChangeNameMeter/Models/RequestChangeNameMeter";
import { getAllReqChangeNameMeter, searchReqChangeNameMeter } from "../../../Requests/RequestChangeNameMeter/Services/RequestChangeNameMeter";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

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
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['change-name-meter'] });
            toast.success("Solicitud de disponibilidad de agua creada con éxito", { position: "top-right", autoClose: 2000 });
        },
        onError: () => {
            toast.error("Error al crear la solicitud de disponibilidad de agua", { position: "top-right", autoClose: 2000 });
        }
    });
}