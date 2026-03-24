// Services/MaterialServices.ts
import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { newProject, Project, ProjectPaginationParams, UpdateProject } from "../Models/Project";

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
    const { page = 1, limit = 10, name, projectState } = params ?? {};
    const { data } = await apiAxios.get<PaginatedResponse<Project>>(`${BASE}/search`, {
      params: { page, limit, name, projectState },
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

export async function downloadProjectPdf(id: number): Promise<Blob> {
  const res = await apiAxios.get<Blob>(`${BASE}/${id}/export/pdf`, {
    responseType: "blob",
  });
  return res.data;
}

function buildProjectPdfFilename(projectId: number, projectName?: string): string {
  const safeName = (projectName ?? `proyecto-${projectId}`)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${safeName || `proyecto-${projectId}`}.pdf`;
}

export async function downloadProjectPdfFile(projectId: number, projectName?: string): Promise<void> {
  const blob = await downloadProjectPdf(projectId);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = buildProjectPdfFilename(projectId, projectName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function createProject(payload: newProject): Promise<Project> {
  try{
    const {data} = await apiAxios.post<Project>(`${BASE}`, payload);
    return data;
  }catch(err){
    console.log(err);
    return Promise.reject(err);
  }
}

export async function updateProject(id: number, payload: UpdateProject): Promise<Project> {
   try{
     const {data} = await apiAxios.put<Project>(`${BASE}/${id}`, payload)
     return data;
   }catch(err){
     console.log('Error descondico',err)
     return Promise.reject(err)
   }
 }

export async function deleteProject(id: number): Promise<void> {
  try{
    await apiAxios.delete(`${BASE}/${id}`);
  } catch (error) {
    console.error("Error al eliminar el proyecto", error);
    return Promise.reject(error);
  }
}
