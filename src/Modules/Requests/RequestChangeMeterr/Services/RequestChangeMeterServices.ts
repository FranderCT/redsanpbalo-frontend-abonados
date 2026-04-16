import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { RequestState } from "../../StateRequest/Model/RequestState";
import type {
  ReqChangeMeter,
  newReqChangeMeter,
  UpdateReqChangeMeterr,
  ReqChangeMeterPaginationParams,
} from "../Models/RequestChangeMeter";

const BASE = "/request-change-meter";
type QueryParamValue = string | number | boolean;
type QueryParams = Record<string, QueryParamValue>;

type ApiError = {
  response?: {
    data?: unknown;
    status?: number;
  };
};

const buildChangeMeterPaginationMeta = (
  page: number,
  limit: number,
  totalItems: number
): PaginatedResponse<ReqChangeMeter>["meta"] => {
  const safeLimit = Math.max(limit, 1);
  const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));

  return {
    totalItems,
    itemCount: 0,
    itemsPerPage: safeLimit,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

const filterChangeMeterRows = (
  rows: ReqChangeMeter[],
  {
    search,
    stateRequestId,
    state,
  }: {
    search?: string;
    stateRequestId?: number;
    state?: string;
  }
) =>
  rows.filter((row) => {
    const matchesText =
      !search ||
      [
        row.Location,
        row.Justification,
        row.User?.Name,
        row.User?.Surname1,
        row.User?.Surname2,
        row.User?.IDcard,
        String(row.NIS ?? ""),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search.toLowerCase()));

    const matchesStateRequest =
      stateRequestId === undefined || row.StateRequest?.Id === stateRequestId;

    const rowState = row.IsActive ? "true" : "false";
    const matchesState = state === undefined || rowState === state;

    return matchesText && matchesStateRequest && matchesState;
  });

const buildClientSideChangeMeterResponse = (
  rows: ReqChangeMeter[],
  page: number,
  limit: number
): PaginatedResponse<ReqChangeMeter> => {
  const start = (page - 1) * limit;
  const paginatedRows = rows.slice(start, start + limit);
  const meta = buildChangeMeterPaginationMeta(page, limit, rows.length);

  return {
    data: paginatedRows,
    meta: {
      ...meta,
      itemCount: paginatedRows.length,
    },
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

export async function getAllReqChangeMeter(): Promise<ReqChangeMeter[]> {
  try {
    const { data } = await apiAxios.get<ReqChangeMeter[]>(BASE);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}


export async function searchReqChangeMeter(
  params: ReqChangeMeterPaginationParams
): Promise<PaginatedResponse<ReqChangeMeter>> {
  const { page = 1, limit = 10, q, StateRequestId, State } = params ?? {};
  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
  const normalizedLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
  const normalizedSearch = q?.trim() || undefined;
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
      StateRequestId: normalizedStateRequestId,
      State: normalizedState,
    }).filter(([, value]) => value !== undefined && value !== null)
  ) as QueryParams;

  if (normalizedSearch) {
    const { data } = await apiAxios.get<ReqChangeMeter[]>(BASE);
    const normalizedRows = filterChangeMeterRows(data, {
      search: normalizedSearch,
      stateRequestId: normalizedStateRequestId,
      state: normalizedState,
    });

    return buildClientSideChangeMeterResponse(
      normalizedRows,
      normalizedPage,
      normalizedLimit
    );
  }

  try {
    console.log("RequestChangeMeter admin search", {
      endpoint: `${BASE}/search`,
      params: queryParams,
    });

    const { data } = await apiAxios.get<PaginatedResponse<ReqChangeMeter>>(`${BASE}/search`, {
      params: queryParams,
    });

    console.log("RequestChangeMeter admin response", {
      meta: data?.meta,
      totalRows: data?.data?.length ?? 0,
    });

    return data;
  } catch (err) {
    const apiError = err as ApiError;

    if (apiError.response?.status === 400) {
      console.warn("RequestChangeMeter admin fallback", {
        params: queryParams,
        response: apiError.response?.data,
      });

      const { data } = await apiAxios.get<ReqChangeMeter[]>(BASE);
      const normalizedRows = filterChangeMeterRows(data, {
        search: normalizedSearch,
        stateRequestId: normalizedStateRequestId,
        state: normalizedState,
      });

      return buildClientSideChangeMeterResponse(
        normalizedRows,
        normalizedPage,
        normalizedLimit
      );
    }

    console.error("Error buscando cambios de medidor", {
      status: apiError.response?.status,
      response: apiError.response?.data,
      error: err,
    });
    return Promise.reject(err);
  }
}

export async function getReqChangeMeterByUser(userId: number): Promise<ReqChangeMeter[]> {
  const { data } = await apiAxios.get<ReqChangeMeter[]>(`${BASE}/user/${userId}`);
  return data;
}

// Detalle
export async function getReqChangeMeterById(id: number): Promise<ReqChangeMeter> {
  try {
    const { data } = await apiAxios.get<ReqChangeMeter>(`${BASE}/${id}`);
    return data;
  } catch (err) {
    console.error(`Error obteniendo cambio de medidor ${id}`, err);
    return Promise.reject(err);
  }
}

// Crear
export async function createReqChangeMeter(
  payload: newReqChangeMeter
): Promise<ReqChangeMeter> {
  try {
    const { data } = await apiAxios.post<ReqChangeMeter>(BASE, payload);
    return data;
  } catch (err) {
    console.error("Error creando cambio de medidor", err);
    return Promise.reject(err);
  }
}

// Actualizar
export async function UpdateReqChangeMeter(
  id: number,
  payload: UpdateReqChangeMeterr
): Promise<ReqChangeMeter> {
  try {
    const { data } = await apiAxios.put<ReqChangeMeter>(`${BASE}/${id}`, payload);
    return data;
  } catch (err) {
    console.error(`Error actualizando disponibilidad de agua ${id}`, err);
    return Promise.reject(err);
  }
}

// Actualizar solo CanComment
export async function updateCanCommentChangeMeter(
  id: number,
  canComment: boolean
): Promise<ReqChangeMeter> {
  try {
    const { data } = await apiAxios.put<ReqChangeMeter>(`${BASE}/${id}`, { CanComment: canComment });
    return data;
  } catch (err) {
    console.error(`Error actualizando CanComment para cambio de medidor ${id}`, err);
    return Promise.reject(err);
  }
}

// Eliminar (soft-delete en back, devuelve entidad guardada)
export async function deleteReqChangeMeter(id: number): Promise<ReqChangeMeter | void> {
  try {
    const { data } = await apiAxios.delete<ReqChangeMeter>(`${BASE}/${id}`);
    return data;
  } catch (err) {
    console.error(`Error eliminando cambio de medidor ${id}`, err);
    return Promise.reject(err);
  }
}
