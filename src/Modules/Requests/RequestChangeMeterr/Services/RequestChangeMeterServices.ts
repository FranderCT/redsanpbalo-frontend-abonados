import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type {
  ReqChangeMeter,
  newReqChangeMeter,
  UpdateReqChangeMeter,
  ReqChangeMeterPaginationParams,
} from "../Models/RequestChangeMeter";

const BASE = "/request-change-meter";


export async function getAllReqChangeMeter(): Promise<ReqChangeMeter[]> {
  try {
    const { data } = await apiAxios.get<ReqChangeMeter[]>(BASE);
    return data;
  } catch (err) {
    console.error("Error obteniendo cambios de medidor", err);
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
export async function updateReqChangeMeter(
  id: number,
  payload: UpdateReqChangeMeter
): Promise<ReqChangeMeter> {
  try {
    // Tu interfaz Update tiene NIS: string; conviértelo si viene como texto
    const body: any = { ...payload };
    if (typeof payload.NIS === "string" && payload.NIS.trim() !== "") {
      const n = Number(payload.NIS);
      if (!Number.isNaN(n)) body.NIS = n;
    }

    const { data } = await apiAxios.put<ReqChangeMeter>(`${BASE}/${id}`, body);
    return data;
  } catch (err) {
    console.error(`Error actualizando cambio de medidor ${id}`, err);
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
