// Services/MaterialServices.ts
import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { newProject, Project, ProjectPaginationParams } from "../Models/Project";

const BASE = "/project"; 
// export async function getProjectCard(): Promise<Project> {
//   try{
//   const response = await apiAxios.get<Project>(`${BASE}/me`);
//   return response.data;
//   }catch(err){
//     console.error(err);
//     return Promise.reject(err);
//   }
  
// }
export async function getAllProjects(): Promise<Project[]> {
  try{
    const {data} = await apiAxios.get<Project[]>(BASE)
    return data;
  }catch(err){
    console.error("Error", err);
    return Promise.reject(err)
  }
}

export async function searchProjects(
  params: ProjectPaginationParams
): Promise<PaginatedResponse<Project>> {
  try {
    const { page = 1, limit = 10, name, state ,projectState} = params ?? {};
    const { data } = await apiAxios.get<PaginatedResponse<Project>>(`${BASE}/search`, {
      params: { page, limit, name, state, projectState },
    });
    return data;
  } catch (err) {
    console.error("Error buscando Proyectos", err);
    return Promise.reject(err);
  }
}

export async function getProjectById(id: number): Promise<Project> {
  const res = await apiAxios.get<Project>(`${BASE}/${id}`);
  return res.data;
}

export async function createProject(payload: newProject): Promise<newProject> {
  try{
    const {data} = await apiAxios.post<Project>(BASE, payload);
    return data;
  }catch(err){
    console.log(err);
    return Promise.reject(err);
  }
}

// export async function updateProject(id: number, payload: updateProjectDto): Promise<Project> {
//   try{
//     const {data} = await apiAxios.patch<Project>(`${BASE}/${id}`, payload)
//     return data;
//   }catch(err){
//     console.log('Error descondico',err)
//     return Promise.reject(err)
//   }
// }

export async function deleteProject(id: number): Promise<void> {
  try{
    await apiAxios.delete(`${BASE}/${id}`);
  } catch (error) {
    console.error("Error al eliminar el proyecto", error);
  }
}
