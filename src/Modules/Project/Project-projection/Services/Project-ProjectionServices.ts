
import apiAxios from "../../../../api/apiConfig";
import type { NewProjectProjection, ProjectProjection } from "../Models/ProjectProjection";

const BASE = 'project-projection';

export async function createProjectProjection (projectProjection : NewProjectProjection) : Promise<ProjectProjection>{
    try{
        const {data} = await apiAxios.post<ProjectProjection>(`${BASE}`, projectProjection);
        return data
    }catch(err){
        return Promise.reject(err)
    }
}