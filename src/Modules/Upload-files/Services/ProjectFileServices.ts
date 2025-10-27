// services/projectFileService.ts
import apiAxios from "../../../api/apiConfig";

export async function uploadProjectFiles(
  projectId: number,
  files: File[],
  subfolder?: string,
  uploadedByUserId?: number
) {
  const formData = new FormData();
  formData.append("projectId", projectId.toString());
  if (subfolder) formData.append("subfolder", subfolder);
  if (uploadedByUserId) formData.append("uploadedByUserId", uploadedByUserId.toString());

  files.forEach((file) => formData.append("files", file));

  try {
    const { data } = await apiAxios.post(`project-file/${projectId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 60 segundos timeout
    });

    return data;
  } catch (error: any) {
    // Mejorar el manejo de errores para facilitar debugging
    console.error('Upload error details:', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      data: error?.response?.data,
      subfolder,
      fileCount: files.length,
      fileNames: files.map(f => f.name)
    });
    
    // Re-lanzar el error para que el retry handler pueda manejarlo
    throw error;
  }
}

export async function uploadRequestAvailabilityWaterFile(
  rqId: number,
  files: File[],
  subfolder?: string,
  uploadedByUserId?: number
) {
  const formData = new FormData();
  formData.append("projectId", rqId.toString());
  if (subfolder) formData.append("subfolder", subfolder);
  if (uploadedByUserId) formData.append("uploadedByUserId", uploadedByUserId.toString());

  files.forEach((file) => formData.append("files", file));

  try {
    const { data } = await apiAxios.post(`request-availability-water-file/${rqId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 60 segundos timeout
    });

    return data;
  } catch (error: any) {
    // Mejorar el manejo de errores para facilitar debugging
    console.error('Upload error details:', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      data: error?.response?.data,
      subfolder,
      fileCount: files.length,
      fileNames: files.map(f => f.name)
    });
    
    // Re-lanzar el error para que el retry handler pueda manejarlo
    throw error;
  }
}


export async function UploadAssociatedFiles (
  rqId: number,
  files: File[],
  subfolder?: string,
  uploadedByUserId?: number
) {
  const formData = new FormData();
  formData.append("projectId", rqId.toString());
  if (subfolder) formData.append("subfolder", subfolder);
  if (uploadedByUserId) formData.append("uploadedByUserId", uploadedByUserId.toString());

  files.forEach((file) => formData.append("files", file));

  try {
    const { data } = await apiAxios.post(`request-associated-file/${rqId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 60 segundos timeout
    });

    return data;
  } catch (error: any) {
    // Mejorar el manejo de errores para facilitar debugging
    console.error('Upload error details:', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      data: error?.response?.data,
      subfolder,
      fileCount: files.length,
      fileNames: files.map(f => f.name)
    });
    
    // Re-lanzar el error para que el retry handler pueda manejarlo
    throw error;
  }
}

  export async function UploadChangeNameMeterFiles (
  rqId: number,
  files: File[],
  subfolder?: string,
  uploadedByUserId?: number
) {
  const formData = new FormData();
  formData.append("projectId", rqId.toString());
  if (subfolder) formData.append("subfolder", subfolder);
  if (uploadedByUserId) formData.append("uploadedByUserId", uploadedByUserId.toString());

  files.forEach((file) => formData.append("files", file));

  try {
    const { data } = await apiAxios.post(`change-name-meter-request-associated-file/${rqId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000,
    });

    return data;
  } catch (error: any) {
    console.error('Upload error details:', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      data: error?.response?.data,
      subfolder,
      fileCount: files.length,
      fileNames: files.map(f => f.name)
    });
    throw error;
  }
}
