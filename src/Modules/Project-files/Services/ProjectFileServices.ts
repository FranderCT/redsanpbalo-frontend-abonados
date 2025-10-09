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

  const { data } = await apiAxios.post(`project-file/${projectId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}


