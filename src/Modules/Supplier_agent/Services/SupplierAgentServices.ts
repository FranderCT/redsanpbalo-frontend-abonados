import apiAxios from "../../../api/apiConfig";
import type { newSupplierAgent, SupplierAgent } from "../Models/SupplierAgent";

const BASE = 'agent-supplier';

export async function createAgentSupplier (payloads : newSupplierAgent) : Promise<SupplierAgent>{
    try{
        const {data} = await apiAxios.post<SupplierAgent>(`${BASE}`, payloads);
        return data;
    }catch(err){
        return Promise.reject(err);
    }
}


export async function editAgentSupplier (Id : number, payload: newSupplierAgent) : Promise<SupplierAgent>{
    try{
        const {data} = await apiAxios.put<SupplierAgent>(`${BASE}/${Id}`, payload)
        return data;
    }catch(err){
        return Promise.reject(err);
    }
}

export async function deleteAgentSupplier (Id : number) : Promise<void>{
    try{
        await apiAxios.delete(`${BASE}/${Id}`)
    }catch(err){
        return Promise.reject(err);
    }
}