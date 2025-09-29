import apiAxios from "../../../api/apiConfig";
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