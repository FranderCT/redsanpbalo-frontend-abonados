import apiAxios from "../../../api/apiConfig";
import type { newProjectTrace, ProjectTrace } from "../Models/ProjectTrace";

const BASE = 'trace-project';

export async function createProjectTrace (payloads : newProjectTrace) : Promise<ProjectTrace>{
    try{
        const {data} = await apiAxios.post<ProjectTrace>(`${BASE}`, payloads);
        return data;
    }catch(err){
        return Promise.reject(err);
    }
}

export async function getProjectTraceById(id: number) : Promise<ProjectTrace>{
  try{
    const {data} = await apiAxios.get<ProjectTrace>(`${BASE}/${id}`);
    return data;
  }catch(err){
    console.error("Error al obtener la informacion del ususario", err);
    return Promise.reject(err);
  }
}
