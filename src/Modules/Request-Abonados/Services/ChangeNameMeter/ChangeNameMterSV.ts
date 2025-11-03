import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { ReqChangeNameMeter } from "../../../Requests/RequestChangeNameMeter/Models/RequestChangeNameMeter";
import type { ChangeNameMeter, NewChangeNameMeter, PartialChangeNameMeter } from "../../Models/ChangeNameMeter/ChangeNameMeter";

const BASE = "/request-change-name-meter";

export async function changeNameMeterRq(payloads: PartialChangeNameMeter) : Promise<ChangeNameMeter>{
    try {
        const { data: response } = await apiAxios.post<ChangeNameMeter>("/request-change-name-meter", payloads);
        return response;
    } catch (error) {
        throw new Error(`Error creating change name meter request: ${error}`);
    }
}

// === Mis solicitudes (usuario autenticado) ===

// Sin paginar
export async function getMyReqChangeNameMeter(): Promise<ReqChangeNameMeter[]> {
  const { data } = await apiAxios.get<ReqChangeNameMeter[]>(`${BASE}/me`);
  return data;
}

export interface MyReqChangeNameMeterParams {
  page?: number;
  limit?: number;
  /** Debe coincidir con el DTO del backend (mayúsculas) */
  StateRequestId?: number;
  /** Texto de búsqueda */
  q?: string;
}
export async function createChangeNameMeterRqAbonado(payloads: NewChangeNameMeter) : Promise<ChangeNameMeter> {
    try {
        const { data: response } = await apiAxios.post<ChangeNameMeter>("/request-change-name-meter", payloads);
        return response;
    } catch (error) {
        throw new Error(`Error creating change name meter request: ${error}`);
    }
}

// Paginado
export async function getMyReqChangeNameMeterPaginated(params: MyReqChangeNameMeterParams = {}): Promise<PaginatedResponse<ReqChangeNameMeter>> {
  // Limpia params undefined / null para un querystring limpio
  const cleanParams = Object.fromEntries(
    Object.entries({
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      StateRequestId: params.StateRequestId, // respeta el Case esperado por el backend
      q: params.q && params.q.trim() ? params.q.trim() : undefined,
    }).filter(([, v]) => v !== undefined && v !== null)
  );

  const { data } = await apiAxios.get<PaginatedResponse<ReqChangeNameMeter>>(
    `${BASE}/me/search`,
    { params: cleanParams }
  );
  return data;
}

// Obtener por Id
export async function getReqChangeNameMeterById(id: number): Promise<ReqChangeNameMeter> {
  const { data } = await apiAxios.get<ReqChangeNameMeter>(`${BASE}/${id}`);
  return data;
}