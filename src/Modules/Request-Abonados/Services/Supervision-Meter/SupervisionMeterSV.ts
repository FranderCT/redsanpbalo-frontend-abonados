import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { ReqSupervisionMeter } from "../../../Requests/RequestSupervisionMeter/Models/ReqSupervisionMeter";
import type { PartialSupervisionMeter, SupervisionMeter } from "../../Models/Supervision-Meter/SupervisionMeter";

const BASE = 'requestsupervision-meter'

export async function createSupervisionMeterRequest(payloads : PartialSupervisionMeter) : Promise<SupervisionMeter> {
    try{
        const {data} = await apiAxios.post<SupervisionMeter>(`${BASE}`, payloads);
        return data;
    } catch (error) {
        throw error;
    }
} 

// === Mis solicitudes (usuario autenticado) ===

// Sin paginar
export async function getMyReqSupervisionMeter(): Promise<ReqSupervisionMeter[]> {
  const { data } = await apiAxios.get<ReqSupervisionMeter[]>(`${BASE}/me`);
  return data;
}

export interface MyReqSupervisionMeterParams {
  page?: number;
  limit?: number;
  /** Debe coincidir con el DTO del backend (mayúsculas) */
  StateRequestId?: number;
  /** Texto de búsqueda */
  q?: string;
}
export async function createSupervisionMeterRqAbonado(payloads: PartialSupervisionMeter) : Promise<SupervisionMeter> {
    try {
        const { data: response } = await apiAxios.post<SupervisionMeter>("/requestsupervision-meter", payloads);
        return response;
    } catch (error) {
        throw new Error(`Error creating supervision meter request: ${error}`);
    }
}

// Paginado
export async function getMyReqSupervisionMeterPaginated(params: MyReqSupervisionMeterParams = {}): Promise<PaginatedResponse<ReqSupervisionMeter>> {
  // Limpia params undefined / null para un querystring limpio
  const cleanParams = Object.fromEntries(
    Object.entries({
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      StateRequestId: params.StateRequestId, // respeta el Case esperado por el backend
      q: params.q && params.q.trim() ? params.q.trim() : undefined,
    }).filter(([, v]) => v !== undefined && v !== null)
  );

  const { data } = await apiAxios.get<PaginatedResponse<ReqSupervisionMeter>>(
    `${BASE}/me/search`,
    { params: cleanParams }
  );
  return data;
}

// Obtener por Id
export async function getReqSupervisionMeterById(id: number): Promise<ReqSupervisionMeter> {
  const { data } = await apiAxios.get<ReqSupervisionMeter>(`${BASE}/${id}`);
  return data;
}