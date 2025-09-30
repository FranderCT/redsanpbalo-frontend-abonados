import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { ProductPaginationParams } from "../../Products/Models/CreateProduct";
import type { LegalSupplier, newLegalSupplier } from "../Models/LegalSupplier";


const BASE = 'legal-supplier';

export async function createLegalSupplier (payloads : newLegalSupplier) : Promise<LegalSupplier>{
    try{
        const {data} = await apiAxios.post<LegalSupplier>(`${BASE}`, payloads);
        return data;
    }catch(err){
        return Promise.reject(err);
    }
}

export async function getAllLegalSupplier (
    params: ProductPaginationParams
    ): Promise<PaginatedResponse<LegalSupplier>> {
     try {
        const { page = 1, limit = 10, name, categoryId, materialId, unitId, state } = params ?? {};
        const { data } = await apiAxios.get<PaginatedResponse<LegalSupplier>>(`${BASE}/search`, {
        params: { page, limit, name, categoryId, materialId, unitId, state },
        });
        return data;
    } catch (err) {
        console.error("Error buscando productos", err);
        return Promise.reject(err);
    }
}

export async function editLegalSupplier (Id : number, payload: newLegalSupplier) : Promise<LegalSupplier>{
    try{
        const {data} = await apiAxios.put<LegalSupplier>(`${BASE}/${Id}`, payload)
        return data;
    }catch(err){
        return Promise.reject(err);
    }
}


export async function getLegalSupplierById(id: number) : Promise<LegalSupplier>{
  try{
    const {data} = await apiAxios.get<LegalSupplier>(`${BASE}/${id}`);
    return data;
  }catch(err){
    console.error("Error al obtener la informacion del ususario", err);
    return Promise.reject(err);
  }
}

export async function deleteLegalSupplier (Id : number) : Promise<void>{
    try{
        await apiAxios.delete(`${BASE}/${Id}`)
    }catch(err){
        return Promise.reject(err);
    }
}

