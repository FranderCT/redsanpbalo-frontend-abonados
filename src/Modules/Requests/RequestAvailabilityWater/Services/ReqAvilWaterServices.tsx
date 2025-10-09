import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { NewReqAvailWater, ReqAvailWater, ReqAvailWaterPaginationParams, UpdateReqAvailWater } from "../Models/ReqAvailWater";


const BASE = "/request-availability-water"; 


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

  export async function updateReqAvailWater(id: number, payload: UpdateReqAvailWater): Promise<ReqAvailWater> {
    try{
      const {data} = await apiAxios.put<ReqAvailWater>(`${BASE}/${id}`, payload)
      return data;
    }catch(err){
      console.log('Error descondico',err)
      return Promise.reject(err)
    }
  }

export async function deleteReqAvailWater(id: number): Promise<void> {
  try{
    await apiAxios.delete(`${BASE}/${id}`);
  } catch (error) {
    console.error("Error al eliminar la solicitud", error);
  }
}
