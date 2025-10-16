// Services/RequestSupervisionMeterServices.ts
import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { newReqSupervisionMeter, ReqSupervisionMeter, ReqSupervisionMeterPaginationParams, UpdateReqSupervisionMeter } from "../Models/ReqSupervisionMeter";


const BASE = "/requestsupervision-meter";

// Listado simple (IsActive = true según el back)
export async function getAllReqSupervisionMeter(): Promise<ReqSupervisionMeter[]> {
  try {
    const { data } = await apiAxios.get<ReqSupervisionMeter[]>(BASE);
    return data;
  } catch (err) {
    console.error("Error obteniendo supervisiones", err);
    return Promise.reject(err);
  }
}

// Búsqueda paginada / filtros
export async function searchReqSupervisionMeter(
  params: ReqSupervisionMeterPaginationParams
): Promise<PaginatedResponse<ReqSupervisionMeter>> {
  try {
    const { page = 1, limit = 10, UserName, StateRequestId, NIS, State } = params ?? {};

    const q: Record<string, any> = { page, limit };
    if (UserName && UserName.trim() !== "") q.UserName = UserName.trim();
    if (typeof StateRequestId === "number") q.StateRequestId = StateRequestId;
    if (typeof NIS === "number" && !Number.isNaN(NIS)) q.NIS = NIS;
    if (State !== undefined && State !== null && State !== "") q.State = State; // backend espera "true"/"false"

    const { data } = await apiAxios.get<PaginatedResponse<ReqSupervisionMeter>>(`${BASE}/search`, {
      params: q,
    });
    return data;
  } catch (err) {
    console.error("Error buscando supervisiones", err);
    return Promise.reject(err);
  }
}

// Detalle
export async function getReqSupervisionMeterById(id: number): Promise<ReqSupervisionMeter> {
  try {
    const { data } = await apiAxios.get<ReqSupervisionMeter>(`${BASE}/${id}`);
    return data;
  } catch (err) {
    console.error(`Error obteniendo supervision ${id}`, err);
    return Promise.reject(err);
  }
}

// Crear
export async function createReqSupervisionMeter(
  payload: newReqSupervisionMeter
): Promise<ReqSupervisionMeter> {
  try {
    const { data } = await apiAxios.post<ReqSupervisionMeter>(BASE, payload);
    return data;
  } catch (err) {
    console.error("Error creando supervision", err);
    return Promise.reject(err);
  }
}

// Actualizar
export async function updateReqSupervisionMeter(
  id: number,
  payload: UpdateReqSupervisionMeter
): Promise<ReqSupervisionMeter> {
  try {
    // Tu interfaz tiene NIS:string; conviértelo a number si viene como string
    const body: any = { ...payload };
    if (typeof payload.NIS === "string" && payload.NIS.trim() !== "") {
      const n = Number(payload.NIS);
      if (!Number.isNaN(n)) body.NIS = n;
    }

    const { data } = await apiAxios.put<ReqSupervisionMeter>(`${BASE}/${id}`, body);
    return data;
  } catch (err) {
    console.error(`Error actualizando supervision ${id}`, err);
    return Promise.reject(err);
  }
}

// Eliminar (soft-delete en back, devuelve entidad guardada)
export async function deleteReqSupervisionMeter(id: number): Promise<ReqSupervisionMeter | void> {
  try {
    const { data } = await apiAxios.delete<ReqSupervisionMeter>(`${BASE}/${id}`);
    return data;
  } catch (err) {
    console.error(`Error eliminando supervision ${id}`, err);
    return Promise.reject(err);
  }
}
