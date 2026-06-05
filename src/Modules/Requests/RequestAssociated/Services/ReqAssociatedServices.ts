// Services/RequestAssociatedServices.ts
import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { RequestState } from "../../StateRequest/Model/RequestState";
import type { newReqAssociated, ReqAssociated, ReqAssociatedPaginationParams, ReqAssociatedResponse, UpdateReqAssociated } from "../Models/RequestAssociated";

const BASE = "/request-associated";
type QueryParamValue = string | number | boolean;
type QueryParams = Record<string, QueryParamValue>;
type ApiError = {
  response?: {
    data?: unknown;
    status?: number;
  };
};

const buildAssociatedPaginationMeta = (
  limit: number,
  //totalItems: number
): PaginatedResponse<ReqAssociated>["meta"] => {
  //const safeLimit = Math.max(limit, 1);
  //const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));

  return {
    hasNextPage: false,
    hasPrevPage: false,
    limit: limit,
    page: 1,
    pageCount: 1,
    total: 0,
  };
};

// Obtener todos los estados de solicitud
export async function getAllRequestStates(): Promise<RequestState[]> {
  try {
    const { data } = await apiAxios.get<RequestState[]>('/state-request');
    
    return data ?? [];
  } catch (err) {
    return Promise.reject(err);
  }
}
// Listado simple (IsActive = true en el back)
export async function getAllRequestAssociated(): Promise<ReqAssociated[]> {
  try {
    const { data } = await apiAxios.get<ReqAssociated[]>(BASE);
    return data;
  } catch (err) {
    console.error("Error obteniendo asociados", err);
    return Promise.reject(err);
  }
}

// Búsqueda paginada / filtros
export async function searchRequestAssociated(
  params: ReqAssociatedPaginationParams
): Promise<PaginatedResponse<ReqAssociated>> {
  const { page = 1, limit = 10, q, StateRequestId, State } = params ?? {};
  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
  const normalizedLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
  const normalizedQ = q?.trim() ? q.trim() : undefined;
  const normalizedStateRequestId =
    typeof StateRequestId === "number" && Number.isFinite(StateRequestId)
      ? StateRequestId
      : undefined;
  const normalizedState =
    typeof State === "string" && State.trim() !== ""
      ? State.trim().toLowerCase()
      : undefined;

  const queryParams = Object.fromEntries(
    Object.entries({
      page: normalizedPage,
      limit: normalizedLimit,
      UserName: normalizedQ,
      StateRequestId: normalizedStateRequestId,
      State: normalizedState,
    }).filter(([, value]) => value !== undefined && value !== null)
  ) as QueryParams;

  try {
    console.log("[ASADA API] GET /request-associated/search", queryParams);

    const { data } = await apiAxios.get<PaginatedResponse<ReqAssociated>>(`${BASE}/search`, {
      params: queryParams,
    });

    console.log("[ASADA API] Respuesta /request-associated/search", {
      meta: data?.meta,
      totalRows: data?.data?.length ?? 0,
    });
    return data;
  } catch (err) {
    const apiError = err as ApiError;
    if (apiError.response?.status === 400) {
      console.warn("[ASADA API] /request-associated/search devolvio 400. Se aplicara fallback local.", {
        params: queryParams,
        response: apiError.response?.data,
      });

      const { data } = await apiAxios.get<ReqAssociated[]>(BASE);
      const normalizedRows = data.filter((row) => {
        const matchesText =
          !normalizedQ ||
          [
            row.Justification,
            row.User?.Name,
            row.User?.Surname1,
            row.User?.Surname2,
            row.User?.IDcard,
            String(row.NIS ?? ""),
          ]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(normalizedQ.toLowerCase())
            );

        const matchesStateRequest =
          normalizedStateRequestId === undefined ||
          row.StateRequest?.Id === normalizedStateRequestId;

        const rowState = row.IsActive ? "true" : "false";
        const matchesState =
          normalizedState === undefined || rowState === normalizedState;

        return matchesText && matchesStateRequest && matchesState;
      });

      const start = (normalizedPage - 1) * normalizedLimit;
      const paginatedRows = normalizedRows.slice(start, start + normalizedLimit);
      const meta = buildAssociatedPaginationMeta(
        normalizedPage,
        //normalizedLimit,
        //normalizedRows.length
      );

      return {
        data: paginatedRows,
        meta: {
          ...meta,
        },
      };
    }

    console.error("Error buscando asociados", {
      status: apiError.response?.status,
      response: apiError.response?.data,
      error: err,
    });
    return Promise.reject(err);
  }
}

export async function getReqAssociatedByUser(userId: number): Promise<ReqAssociated[]> {
  const { data } = await apiAxios.get<ReqAssociated[]>(`${BASE}/user/${userId}`);
  return data;
}

// Detalle
export async function getRequestAssociatedById(id: number): Promise<ReqAssociated> {
  try {
    const { data } = await apiAxios.get<ReqAssociated>(`${BASE}/${id}`);
    return data;
  } catch (err) {
    console.error(`Error obteniendo asociado ${id}`, err);
    return Promise.reject(err);
  }
}

// Crear
export async function createRequestAssociated(
  payload: newReqAssociated
): Promise<ReqAssociated> {
  try {
    const { data } = await apiAxios.post<ReqAssociated>(BASE, payload);
    return data;
  } catch (err) {
    console.error("Error creando asociado", err);
    return Promise.reject(err);
  }
}

// Actualizar 
export async function UpdateAssociatedReq(
  id: number,
  payload: UpdateReqAssociated
): Promise<ReqAssociated> {
  try {
    const { data } = await apiAxios.put<ReqAssociated>(`${BASE}/${id}`, payload);
    return data;
  } catch (err) {
    console.error(`Error actualizando disponibilidad de agua ${id}`, err);
    return Promise.reject(err);
  }
}

// Actualizar solo CanComment
export async function updateCanComment(
  id: number,
  canComment: boolean
): Promise<ReqAssociated> {
  try {
    const { data } = await apiAxios.put<ReqAssociated>(`${BASE}/${id}`, { CanComment: canComment });
    return data;
  } catch (err) {
    console.error(`Error actualizando CanComment para asociado ${id}`, err);
    return Promise.reject(err);
  }
}

// Eliminar (soft-delete en back)
export async function deleteRequestAssociated(id: number): Promise<ReqAssociated | void> {
  try {
    const { data } = await apiAxios.delete<ReqAssociated>(`${BASE}/${id}`);
    return data;
  } catch (err) {
    console.error(`Error eliminando asociado ${id}`, err);
    return Promise.reject(err);
  }
}

export async function getReqAssociatedFolderLink(id: number): Promise<ReqAssociatedResponse> {
  try {
    const { data } = await apiAxios.get<ReqAssociatedResponse>(`/request-associated-file/folder-link/${id}`);
    return data;
  } catch (err) {
    const apiError = err as ApiError;
    console.error(`❌ Error obteniendo link de carpeta para solicitud ${id}`, err);
    console.error('Response:', apiError.response?.data);
    return Promise.reject(err);
  }
}
