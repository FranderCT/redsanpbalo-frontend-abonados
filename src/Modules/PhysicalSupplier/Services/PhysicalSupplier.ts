import apiAxios from "../../../api/apiConfig";
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