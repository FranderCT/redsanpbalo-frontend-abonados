// ProjectFileServices.ts
import apiAxios from "../../../api/apiConfig";

export interface ProjectFileMetadata {
  Project: {
    Id: number;
    Name: string;
  };
  Path: string;
  FileName: string;
  MimeType: string;
  Size: number;
  Rev: string;
  Id?: number;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export type UploadProjectFilesResponse = ProjectFileMetadata[];

export async function uploadProjectFiles(
  projectId: number, 
  files: File[], 
  subfolder = 'Complementarios',
  uploadedByUserId?: number
): Promise<UploadProjectFilesResponse> {
  try {
    const form = new FormData();
    files.forEach(f => form.append('files', f)); // 👈 mismo key 'files'
    form.append('subfolder', subfolder);
    
    // Agregar userId si se proporciona
    if (uploadedByUserId) {
      form.append('uploadedByUserId', uploadedByUserId.toString());
    }

    const res = await apiAxios.post<UploadProjectFilesResponse>(`/project-file/${projectId}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return res.data;
  } catch (err: any) {
    console.error('Error al subir archivos del proyecto:', err);
    
    // Enriquecer el error con información más específica
    if (err?.response) {
      const status = err.response.status;
      const message = err.response.data?.message || err.message;
      
      // Crear un error más descriptivo
      const enhancedError = new Error(`Error ${status}: ${message}`);
      (enhancedError as any).response = err.response;
      (enhancedError as any).status = status;
      
      return Promise.reject(enhancedError);
    }
    
    return Promise.reject(err);
  }
}

export async function deleteProjectFile(
  projectId: number, 
  filename: string, 
  subfolder = 'Complementarios'
): Promise<{ message: string }> {
  try {
    const res = await apiAxios.delete<{ message: string }>(`/projects/${projectId}/files/${filename}`, {
      params: { subfolder }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error al eliminar archivo del proyecto:', err);
    return Promise.reject(err);
  }
}

export async function getProjectFiles(
  projectId: number, 
  subfolder = 'Complementarios'
): Promise<{ files: string[] }> {
  try {
    const res = await apiAxios.get<{ files: string[] }>(`/projects/${projectId}/files`, {
      params: { subfolder }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error al obtener archivos del proyecto:', err);
    return Promise.reject(err);
  }
}