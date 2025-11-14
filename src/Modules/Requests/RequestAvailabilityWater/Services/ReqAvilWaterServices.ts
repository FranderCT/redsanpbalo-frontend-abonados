import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { RequestState } from "../../StateRequest/Model/RequestState";
import type { NewReqAvailWater, ReqAvailWater, ReqAvailWaterPaginationParams, ReqWaterLinkResponse, UpdateReqAvailabilityWater} from "../Models/ReqAvailWater";



const BASE = "/request-availability-water"; 
// Obtener todos los estados de solicitud
export async function getAllRequestStates(): Promise<RequestState[]> {
  try {
    const { data } = await apiAxios.get<RequestState[]>('/state-request');
    
    console.log('✅ Estados recibidos de la API:', data);
    
    // ✅ La API ya devuelve el formato correcto con Id
    return data ?? [];
  } catch (err: any) {
    console.error("❌ Error obteniendo estados:", err);
    console.error("URL intentada:", err?.config?.url);
    console.error("Status:", err?.response?.status);
    return Promise.reject(err);
  }
}

export async function getAllReqAvailWater(): Promise<ReqAvailWater[]> {
  try{
    const {data} = await apiAxios.get<ReqAvailWater[]>(BASE)
    return data;
  }catch(err){
    console.error("Error", err);
    return Promise.reject(err)
  }
}

// --- service (sin cambiar tu firma) ---
export async function searchReqAvailWater(
  params: ReqAvailWaterPaginationParams
): Promise<PaginatedResponse<ReqAvailWater>> {
  try {
    const { page = 1, limit = 10, State, StateRequestId, UserName } = params ?? {};

    const q: Record<string, any> = { page, limit };
    if (UserName) q.UserName = UserName;
    if (State !== undefined && State !== null && State !== "") q.State = State;          // "true"/"false"
    if (typeof StateRequestId === "number") q.StateRequestId = StateRequestId;

    const { data } = await apiAxios.get<PaginatedResponse<ReqAvailWater>>(`${BASE}/search`, {
      params: q,
    });
    return data;
  } catch (err) {
    console.error("Error buscando Solicitudes", err);
    return Promise.reject(err);
  }
}


export async function getReqAvailWaterById(id: number): Promise<ReqAvailWater> {
  const res = await apiAxios.get<ReqAvailWater>(`${BASE}/${id}`);
  return res.data;
}

export async function createReqAvailWater(payloads: NewReqAvailWater) : Promise<NewReqAvailWater>{
    try{
        const {data} = await apiAxios.post<NewReqAvailWater>(BASE, payloads);
        return data;
    }catch(err){
        console.log(err);
        return Promise.reject(err);
    }

}

export async function UpdateReqAvailWater(
  id: number,
  payload: UpdateReqAvailabilityWater  
): Promise<ReqAvailWater> {
  try {
    const { data } = await apiAxios.put<ReqAvailWater>(`${BASE}/${id}`, payload);
    return data;
  } catch (err) {
    console.error(`Error actualizando disponibilidad de agua ${id}`, err);
    return Promise.reject(err);
  }
}

// Actualizar solo CanComment
export async function updateCanCommentAvailWater(
  id: number,
  canComment: boolean
): Promise<ReqAvailWater> {
  try {
    const { data } = await apiAxios.put<ReqAvailWater>(`${BASE}/${id}`, { CanComment: canComment });
    return data;
  } catch (err) {
    console.error(`Error actualizando CanComment para disponibilidad de agua ${id}`, err);
    return Promise.reject(err);
  }
}

export async function deleteReqAvailWater(id: number): Promise<void> {
  try{
    await apiAxios.delete(`${BASE}/${id}`);
  } catch (error) {
    console.error("Error al eliminar la solicitud", error);
  }
}

export async function getReqAvailWaterFolderLink(id: number): Promise<ReqWaterLinkResponse> {
  try {
    // La ruta correcta es /request-availability-water-file/folder-link/:id
    const { data } = await apiAxios.get<ReqWaterLinkResponse>(`/request-availability-water-file/folder-link/${id}`);
    
    console.log('✅ Link de carpeta recibido:', data);
    return data;
  } catch (err: any) {
    console.error(`❌ Error obteniendo link de carpeta para solicitud ${id}`, err);
    console.error('Response:', err?.response?.data);
    return Promise.reject(err);
  }
}