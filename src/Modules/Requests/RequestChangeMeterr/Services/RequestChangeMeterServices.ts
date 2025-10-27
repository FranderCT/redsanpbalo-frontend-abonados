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

// Obtener todos los estados de solicitud
export async function getAllRequestStates(): Promise<RequestState[]> {
  try {
    const { data } = await apiAxios.get<RequestState[]>('/state-request');
    
    return data ?? [];
  } catch (err: any) {
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
  try {
    const { page = 1, limit = 10, UserName, StateRequestId, State } = params ?? {};

    const q: Record<string, any> = { page, limit };
    if (UserName && UserName.trim() !== "") q.UserName = UserName.trim();
    if (typeof StateRequestId === "number") q.StateRequestId = StateRequestId;
    if (State !== undefined && State !== null && State !== "") q.State = State; // "" | "true" | "false"

    const { data } = await apiAxios.get<PaginatedResponse<ReqChangeMeter>>(`${BASE}/search`, {
      params: q,
    });
    return data;
  } catch (err) {
    console.error("Error buscando cambios de medidor", err);
    return Promise.reject(err);
  }
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
