import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { ReqChangeMeter } from "../../../Requests/RequestChangeMeterr/Models/RequestChangeMeter";
import type { ChangeMeter, PartialChangeMeter } from "../../Models/Change-Meter/ChangeMeter";

const BASE = "/request-change-meter";

export async function createChangeMeterRequest(payloads : PartialChangeMeter) : Promise<ChangeMeter> {
    try{
        const {data} = await apiAxios.post<ChangeMeter>(`${BASE}`, payloads);
        return data;
    } catch (error) {
        throw error;
    }
}

// === Mis solicitudes (usuario autenticado) ===

// Sin paginar
export async function getMyReqChangeMeter(): Promise<ReqChangeMeter[]> {
  const { data } = await apiAxios.get<ReqChangeMeter[]>(`${BASE}/me`);
  return data;
}

export interface MyReqChangeMeterParams {
  page?: number;
  limit?: number;
  /** Debe coincidir con el DTO del backend (mayúsculas) */
  StateRequestId?: number;
  /** Texto de búsqueda */
  q?: string;
}
export async function createChangeMeterRqAbonado(payloads: PartialChangeMeter) : Promise<ChangeMeter> {
    try {
        const { data: response } = await apiAxios.post<ChangeMeter>("/request-change-meter", payloads);
        return response;
    } catch (error) {
        throw new Error(`Error creating change meter request: ${error}`);
    }
}

// Paginado
export async function getMyReqChangeMeterPaginated(params: MyReqChangeMeterParams = {}): Promise<PaginatedResponse<ReqChangeMeter>> {
  // Limpia params undefined / null para un querystring limpio
  const cleanParams = Object.fromEntries(
    Object.entries({
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      StateRequestId: params.StateRequestId, // respeta el Case esperado por el backend
      q: params.q && params.q.trim() ? params.q.trim() : undefined,
    }).filter(([, v]) => v !== undefined && v !== null)
  );

  const { data } = await apiAxios.get<PaginatedResponse<ReqChangeMeter>>(
    `${BASE}/me/search`,
    { params: cleanParams }
  );
  return data;
}

// Obtener por Id
export async function getReqChangeMeterById(id: number): Promise<ReqChangeMeter> {
  const { data } = await apiAxios.get<ReqChangeMeter>(`${BASE}/${id}`);
  return data;
}