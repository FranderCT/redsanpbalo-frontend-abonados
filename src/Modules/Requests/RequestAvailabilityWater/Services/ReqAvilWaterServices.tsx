import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { NewReqAvailWater, ReqAvailWater, ReqAvailWaterPaginationParams, UpdateReqAvailWater } from "../Models/ReqAvailWater";


const BASE = "/reques-availability-water"; 


export async function getAllReqAvailWater(): Promise<ReqAvailWater[]> {
  try{
    const {data} = await apiAxios.get<ReqAvailWater[]>(BASE)
    return data;
  }catch(err){
    console.error("Error", err);
    return Promise.reject(err)
  }
}

export async function searchReqAvailWater(
  params: ReqAvailWaterPaginationParams
): Promise<PaginatedResponse<ReqAvailWater>> {
  try {
    const { page = 1, limit = 10, justification, state, stateRequestId, userId } = params ?? {};
    const { data } = await apiAxios.get<PaginatedResponse<ReqAvailWater>>(`${BASE}/search`, {
      params: { page, limit, justification, state, stateRequestId, userId },
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

export async function createReqAvailWater(payload: NewReqAvailWater): Promise<NewReqAvailWater> {
  try{
    const {data} = await apiAxios.post<ReqAvailWater>(BASE, payload);
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
