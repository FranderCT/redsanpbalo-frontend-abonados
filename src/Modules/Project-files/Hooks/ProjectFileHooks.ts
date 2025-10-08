// ProjectFileHooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadProjectFiles, deleteProjectFile, getProjectFiles, type UploadProjectFilesResponse } from "../Services/ProjectFileServices";

// Hook para subir archivos del proyecto
export const useUploadProjectFiles = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<
    UploadProjectFilesResponse,
    Error,
    { projectId: number; files: File[]; subfolder?: string; uploadedByUserId?: number }
  >({
    mutationFn: ({ projectId, files, subfolder = 'Complementarios', uploadedByUserId }) => 
      uploadProjectFiles(projectId, files, subfolder, uploadedByUserId),
    onSuccess: (res, variables) => {
      console.log('Archivos subidos correctamente:', res);
      // Invalidar la consulta de archivos del proyecto para refrescar la lista
      queryClient.invalidateQueries({ 
        queryKey: ['project-files', variables.projectId, variables.subfolder] 
      });
    },
    onError: (err) => {
      console.error('Error al subir archivos:', err);
    }
  });

  return mutation;
};

// Hook para obtener archivos del proyecto
export const useGetProjectFiles = (projectId?: number, subfolder = 'Complementarios') => {
  const { data, isPending, error } = useQuery({
    queryKey: ['project-files', projectId, subfolder],
    queryFn: () => getProjectFiles(projectId as number, subfolder),
    enabled: typeof projectId === 'number' && projectId > 0,
  });

  return { 
    projectFiles: data?.files ?? [], 
    isPending, 
    error 
  };
};

// Hook para eliminar un archivo del proyecto
export const useDeleteProjectFile = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<
    { message: string },
    Error,
    { projectId: number; filename: string; subfolder?: string }
  >({
    mutationFn: ({ projectId, filename, subfolder = 'Complementarios' }) => 
      deleteProjectFile(projectId, filename, subfolder),
    onSuccess: (res, variables) => {
      console.log('Archivo eliminado correctamente:', res);
      // Invalidar la consulta de archivos del proyecto para refrescar la lista
      queryClient.invalidateQueries({ 
        queryKey: ['project-files', variables.projectId, variables.subfolder] 
      });
    },
    onError: (err) => {
      console.error('Error al eliminar archivo:', err);
    }
  });

  return mutation;
};