// Services/RequestAssociatedServices.ts
import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { RequestState } from "../../StateRequest/Model/RequestState";
import type { newReqAssociated, ReqAssociated, ReqAssociatedPaginationParams, ReqAssociatedResponse, UpdateReqAssociated } from "../Models/RequestAssociated";

const BASE = "/request-associated";

// Obtener todos los estados de solicitud
export async function getAllRequestStates(): Promise<RequestState[]> {
  try {
    const { data } = await apiAxios.get<RequestState[]>('/state-request');
    
    return data ?? [];
  } catch (err: any) {
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
  try {
    const { page = 1, limit = 10, UserName, StateRequestId, State } = params ?? {};

    const q: Record<string, any> = { page, limit };
    if (UserName && UserName.trim() !== "") q.UserName = UserName.trim();
    if (typeof StateRequestId === "number") q.StateRequestId = StateRequestId;
    if (State !== undefined && State !== null && State !== "") q.State = State; // "" | "true" | "false"

    const { data } = await apiAxios.get<PaginatedResponse<ReqAssociated>>(`${BASE}/search`, {
      params: q,
    });
    return data;
  } catch (err) {
    console.error("Error buscando asociados", err);
    return Promise.reject(err);
  }
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
  } catch (err: any) {
    console.error(`❌ Error obteniendo link de carpeta para solicitud ${id}`, err);
    console.error('Response:', err?.response?.data);
    return Promise.reject(err);
  }
}
