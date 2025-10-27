import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { ReqAvailWater } from "../../../Requests/RequestAvailabilityWater/Models/ReqAvailWater";
import type { AvailabilityWater, PartialAvailabilityWater } from "../../Models/AvailabilityWater/AvailabilityWater";

const BASE = "/request-availability-water"; 


export async function createAvailabilityWaterRq(payload: PartialAvailabilityWater): Promise<AvailabilityWater> {
  const { data } = await apiAxios.post<AvailabilityWater>(`${BASE}`, payload);
  return data;
}

// === Mis solicitudes (usuario autenticado) ===

// Sin paginar
export async function getMyReqAvailWater(): Promise<ReqAvailWater[]> {
  const { data } = await apiAxios.get<ReqAvailWater[]>(`${BASE}/me`);
  return data;
}

export interface MyReqAvailWaterParams {
  page?: number;
  limit?: number;
  /** Debe coincidir con el DTO del backend (mayúsculas) */
  StateRequestId?: number;
  /** Texto de búsqueda */
  q?: string;
}

// Paginado
export async function getMyReqAvailWaterPaginated(params: MyReqAvailWaterParams = {}): Promise<PaginatedResponse<ReqAvailWater>> {
  // Limpia params undefined / null para un querystring limpio
  const cleanParams = Object.fromEntries(
    Object.entries({
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      StateRequestId: params.StateRequestId, // respeta el Case esperado por el backend
      q: params.q && params.q.trim() ? params.q.trim() : undefined,
    }).filter(([, v]) => v !== undefined && v !== null)
  );

  const { data } = await apiAxios.get<PaginatedResponse<ReqAvailWater>>(
    `${BASE}/me/search`,
    { params: cleanParams }
  );
  return data;
}

// Obtener por Id
export async function getReqAvailWaterById(id: number): Promise<ReqAvailWater> {
  const { data } = await apiAxios.get<ReqAvailWater>(`${BASE}/${id}`);
  return data;
}
