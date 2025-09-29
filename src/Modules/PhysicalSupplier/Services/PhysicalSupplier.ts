import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { ProductPaginationParams } from "../../Products/Models/CreateProduct";
import type { newPhysicalSupplier, PhysicalSupplier } from "../Models/PhysicalSupplier";

const BASE = 'physical-supplier';

export async function createPhysicalSupplier (payloads : newPhysicalSupplier) : Promise<PhysicalSupplier>{
    try{
        const {data} = await apiAxios.post<PhysicalSupplier>(`${BASE}`, payloads);
        return data;
    }catch(err){
        return Promise.reject(err);
    }
}

export async function getAllPhysicalSupplier (
    params: ProductPaginationParams
    ): Promise<PaginatedResponse<PhysicalSupplier>> {
     try {
        const { page = 1, limit = 10, name, categoryId, materialId, unitId, state } = params ?? {};
        const { data } = await apiAxios.get<PaginatedResponse<PhysicalSupplier>>(`${BASE}/search`, {
        params: { page, limit, name, categoryId, materialId, unitId, state },
        });
        return data;
    } catch (err) {
        console.error("Error buscando productos", err);
        return Promise.reject(err);
    }
}