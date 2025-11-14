// Services/RequestChangeNameMeterServices.ts
import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { RequestState } from "../../StateRequest/Model/RequestState";
import type {
  ReqChangeNameMeter,
  newReqChangeNameMeter,
  ReqChangeNameMeterPaginationParams,
  UpdateReqChangeNameMeter,
  ReqChangeNameLinkResponse,
} from "../Models/RequestChangeNameMeter";

const BASE = "/request-change-name-meter";

// Obtener todos los estados de solicitud
export async function getAllRequestStates(): Promise<RequestState[]> {
  try {
    const { data } = await apiAxios.get<RequestState[]>('/state-request');
    
    return data ?? [];
  } catch (err: any) {
    return Promise.reject(err);
  }
}

// Listado simple
export async function getAllReqChangeNameMeter(): Promise<ReqChangeNameMeter[]> {
  try {
    const { data } = await apiAxios.get<ReqChangeNameMeter[]>(BASE);
    return data;
  } catch (err) {
    console.error("Error obteniendo cambios de nombre de medidor", err);
    return Promise.reject(err);
  }
}

// Búsqueda paginada
export async function searchReqChangeNameMeter(
  params: ReqChangeNameMeterPaginationParams
): Promise<PaginatedResponse<ReqChangeNameMeter>> {
  try {
    const { page = 1, limit = 10, UserName, StateRequestId, State } = params ?? {};

    const q: Record<string, any> = { page, limit };
    if (UserName && UserName.trim() !== "") q.UserName = UserName.trim();
    if (typeof StateRequestId === "number") q.StateRequestId = StateRequestId;
    if (State !== undefined && State !== null && State !== "") q.State = State; // "" | "true" | "false"

    const { data } = await apiAxios.get<PaginatedResponse<ReqChangeNameMeter>>(`${BASE}/search`, {
      params: q,
    });
    return data;
  } catch (err) {
    console.error("Error buscando cambios de nombre de medidor", err);
    return Promise.reject(err);
  }
}

// Detalle
export async function getReqChangeNameMeterById(id: number): Promise<ReqChangeNameMeter> {
  try {
    const { data } = await apiAxios.get<ReqChangeNameMeter>(`${BASE}/${id}`);
    return data;
  } catch (err) {
    console.error(`Error obteniendo cambio de nombre de medidor ${id}`, err);
    return Promise.reject(err);
  }
}

// Crear
export async function createReqChangeNameMeter(
  payload: newReqChangeNameMeter
): Promise<ReqChangeNameMeter> {
  try {
    const { data } = await apiAxios.post<ReqChangeNameMeter>(BASE, payload);
    return data;
  } catch (err) {
    console.error("Error creando cambio de nombre de medidor", err);
    return Promise.reject(err);
  }
}

//Actualizar
export async function updateReqChangeNameMeter(
  id: number,
  payload: UpdateReqChangeNameMeter
): Promise<ReqChangeNameMeter> {
  try {
    const { data } = await apiAxios.put<ReqChangeNameMeter>(`${BASE}/${id}`, payload);
    return data;
  } catch (err) {
    console.error(`Error actualizando cambio de nombre de medidor ${id}`, err);
    return Promise.reject(err);
  }
}

// Actualizar solo CanComment
export async function updateCanCommentChangeNameMeter(
  id: number,
  canComment: boolean
): Promise<ReqChangeNameMeter> {
  try {
    const { data } = await apiAxios.put<ReqChangeNameMeter>(`${BASE}/${id}`, { CanComment: canComment });
    return data;
  } catch (err) {
    console.error(`Error actualizando CanComment para cambio de nombre de medidor ${id}`, err);
    return Promise.reject(err);
  }
}

export async function deleteReqChangeNameMeter(id: number): Promise<ReqChangeNameMeter | void> {
  try {
    const { data } = await apiAxios.delete<ReqChangeNameMeter>(`${BASE}/${id}`);
    return data;
  } catch (err) {
    console.error(`Error eliminando cambio de nombre de medidor ${id}`, err);
    return Promise.reject(err);
  }
}

export async function getReqChangeNameFolderLink(id: number): Promise<ReqChangeNameLinkResponse> {
  try {
    // La ruta correcta es /request-availability-water-file/folder-link/:id
    const { data } = await apiAxios.get<ReqChangeNameLinkResponse>(`/request-change-name-meter-file/folder-link/${id}`);
    
    console.log('Link de carpeta recibido:', data);
    return data;
  } catch (err: any) {
    console.error(` Error obteniendo link de carpeta para solicitud ${id}`, err);
    console.error('Response:', err?.response?.data);
    return Promise.reject(err);
  }
}
