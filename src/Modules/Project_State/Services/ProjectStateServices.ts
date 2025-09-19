import apiAxios from "../../../api/apiConfig";
import type { ProjectState } from "../Models/ProjectState";

const BASE = 'project-state';

export async function getAllProjectStates (): Promise <ProjectState[]>{
    try{
        const res = await  apiAxios.get<ProjectState[]>(`${BASE}`)
        return res.data;
    }catch(err){
        console.error(err);
        return Promise.reject(err);
    }
}