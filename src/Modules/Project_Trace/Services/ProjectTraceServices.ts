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