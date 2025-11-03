import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { ReqAssociated } from "../../../Requests/RequestAssociated/Models/RequestAssociated";
import type { Associated, PartialAssociated } from "../../Models/Associated/Associated";

const BASE = '/request-associated';

export async function createAssociatedRequest (payloads: PartialAssociated) : Promise<Associated> {
   try{
    const {data} = await apiAxios.post<Associated>(`${BASE}`, payloads);
    return data;
   } catch (error) {
       throw new Error(`Error creating associated request: ${error}`);
   }
}

// === Mis solicitudes (usuario autenticado) ===

// Sin paginar
export async function getMyReqAssociated(): Promise<ReqAssociated[]> {
  const { data } = await apiAxios.get<ReqAssociated[]>(`${BASE}/me`);
  return data;
}

export interface MyReqAssociatedParams {
  page?: number;
  limit?: number;
  /** Debe coincidir con el DTO del backend (mayúsculas) */
  StateRequestId?: number;
  /** Texto de búsqueda */
  q?: string;
}
export async function createAssociatedRqAbonado(payloads: PartialAssociated) : Promise<Associated> {
    try {
        const { data: response } = await apiAxios.post<Associated>("/request-associated", payloads);
        return response;
    } catch (error) {
        throw new Error(`Error creating associated request: ${error}`);
    }
}

// Paginado
export async function getMyReqAssociatedPaginated(params: MyReqAssociatedParams = {}): Promise<PaginatedResponse<ReqAssociated>> {
  // Limpia params undefined / null para un querystring limpio
  const cleanParams = Object.fromEntries(
    Object.entries({
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      StateRequestId: params.StateRequestId, // respeta el Case esperado por el backend
      q: params.q && params.q.trim() ? params.q.trim() : undefined,
    }).filter(([, v]) => v !== undefined && v !== null)
  );

  const { data } = await apiAxios.get<PaginatedResponse<ReqAssociated>>(
    `${BASE}/me/search`,
    { params: cleanParams }
  );
  return data;
}

// Obtener por Id
export async function getReqAssociatedById(id: number): Promise<ReqAssociated> {
  const { data } = await apiAxios.get<ReqAssociated>(`${BASE}/${id}`);
  return data;
}