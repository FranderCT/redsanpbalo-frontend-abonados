import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../Users/Models/Users";
import type { NewUnit, Unit, UnitPaginationParams } from "../Models/unit";

export async function createUnitMeasure(payloads: NewUnit) : Promise<NewUnit>{
    try{
        const {data} = await apiAxios.post<NewUnit>(`unit-measure`, payloads);
        return data;
    }catch(err){
        console.log(err);
        return Promise.reject(err);
    }
}

export async function UpdateUnitMeasure (id: number, payloads: NewUnit) : Promise<Unit>{
    try{
        const {data} = await apiAxios.put<Unit>(`unit-measure/${id}`, payloads)
        return data;
    }catch(err){
        console.log('Error descondico',err)
        return Promise.reject(err)
    }
}

export async function getAllUnitsMeasure () : Promise<Unit[]>{
    try{
        const {data} = await apiAxios.get<Unit[]>('unit-measure')
        return data;
    }catch(err){
        console.error("Error", err);
        return Promise.reject(err)
    }
}

export async function searchUnits(
  params: UnitPaginationParams
): Promise<PaginatedResponse<Unit>> {
  try {
    const { page = 1, limit = 10, name, state } = params ?? {};
    const { data } = await apiAxios.get<PaginatedResponse<Unit>>("unit-measure/search", {
      params: { page, limit, name, state },
    });
    return data;
  } catch (err) {
    console.error("Error buscando unidades de medida", err);
    return Promise.reject(err);
  }
}

export async function deleteUnitMeasure(id: number): Promise<void> {
  try {
    await apiAxios.delete(`/unit-measure/${id}`);
  } catch (error) {
    console.error("Error al eliminar la unidad de medida", error);
  }
}