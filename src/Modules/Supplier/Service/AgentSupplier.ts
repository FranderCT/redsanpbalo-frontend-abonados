import apiAxios from "../../../api/apiConfig";
import type { AgentSupplier } from "../Models/AgentSupplier";


const BASE = 'agent-supplier';

export async function createAgentSupplier (newAgent : AgentSupplier) : Promise<AgentSupplier>{
    try{
        const {data} = await apiAxios.post<AgentSupplier>(`${BASE}`, newAgent);
        return data;
    }catch(err){
        console.error(err);
        return Promise.reject(err);
    }
}