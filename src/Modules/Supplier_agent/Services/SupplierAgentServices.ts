import apiAxios from "../../../api/apiConfig";
import type { AgentSupppliers, newAgentSupppliers } from "../Models/SupplierAgent";


const BASE = 'agent-supplier';

export async function createAgentSupplier (payloads : newAgentSupppliers) : Promise<AgentSupppliers>{
    try{
        const {data} = await apiAxios.post<AgentSupppliers>(`${BASE}`, payloads);
        return data;
    }catch(err){
        return Promise.reject(err);
    }
}


export async function editAgentSupplier (Id : number, payload: newAgentSupppliers) : Promise<AgentSupppliers>{
    try{
        const {data} = await apiAxios.put<AgentSupppliers>(`${BASE}/${Id}`, payload)
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