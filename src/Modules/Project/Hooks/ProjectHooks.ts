// Hooks/MaterialHooks.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import { showApiErrorToast } from "@/core/api-error";
import { toast } from "sonner";
import { createProject, deleteProject, downloadProjectPdfFile, getAllProjects, getProjectById, removeProjectCoverImage, searchProjects, updateProject, uploadProjectCoverImage } from "../Services/ProjectServices";
import type { Project, ProjectPaginationParams, UpdateProject } from "../Models/Project";
import { projectKeys } from "../queryKeys";

// Obtener todos
export const useGetAllProjects = () => {
  const { data: projects, isPending, error } = useQuery({
    queryKey: projectKeys.list(),
    queryFn: getAllProjects,
  });
  return { projects, isPending, error };
};

// export const useGetProjectCard = () => {
//     const {data: ProjectCard, isLoading, error} = useQuery({
//         queryKey: ['projectCard'],
//         queryFn: () => getProjectCard()
//     });

//     return { ProjectCard, isLoading, error };
// }

export const useSearchProjects = (params: ProjectPaginationParams) => {
  return useQuery<PaginatedResponse<Project>, Error>({
    queryKey: projectKeys.search(params),
    queryFn: () => searchProjects(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};


// Obtener por ID
export const useGetProjectById = (id?: number) => {
  const { data: project, isPending, error } = useQuery({
    queryKey: typeof id === "number" && id > 0 ? projectKeys.detail(id) : [...projectKeys.detailRoot(), "invalid"],
    queryFn: () => getProjectById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
  return { project, isPending, error };
};

// Crear
export const useCreateProject = () => {
  const qc = useQueryClient();
  const mutation = useMutation({
      mutationFn: createProject,
      onSuccess: (res) =>{
          console.log('Proyecto creado correctamente',res)
          qc.invalidateQueries({queryKey: projectKeys.all})
          qc.invalidateQueries({queryKey: projectKeys.dashboardInProcessCount})
      },
      onError: (err) =>{
          console.error('Error al crear', err)
          showApiErrorToast(err);
      }
  })

  return mutation;
};

// Actualizar
 export const useUpdateProject = () => {
   const qc = useQueryClient();
  
   const mutation = useMutation<Project, Error, {id: number; data: UpdateProject }>({
       mutationFn: ({id, data}) => updateProject(id, data),
       onSuccess :(res, variables)=>{
           console.log('Proyecto Actualizado', console.log(res))
           qc.invalidateQueries({queryKey: projectKeys.all})
           qc.invalidateQueries({queryKey: projectKeys.detail(variables.id)})
           qc.invalidateQueries({queryKey: projectKeys.dashboardInProcessCount})
       },
       onError: (err) =>{
           console.error(err);
           showApiErrorToast(err);
       }
   })

   return mutation;
 };

export const useUploadProjectCoverImage = () => {
  const qc = useQueryClient();
  return useMutation<Project, Error, { id: number; file: File }>({
    mutationFn: ({ id, file }) => uploadProjectCoverImage(id, file),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      qc.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
    },
    onError: (err) => {
      console.error("Error subiendo portada", err);
      showApiErrorToast(err);
    },
  });
};

export const useRemoveProjectCoverImage = () => {
  const qc = useQueryClient();
  return useMutation<{ ok: boolean }, Error, { id: number }>({
    mutationFn: ({ id }) => removeProjectCoverImage(id),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      qc.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
    },
    onError: (err) => {
      console.error("Error eliminando portada", err);
      showApiErrorToast(err);
    },
  });
};

// Eliminar
export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      qc.invalidateQueries({ queryKey: projectKeys.dashboardInProcessCount });
      console.log("Proyecto inhabilitado", res);
    },
    onError: (err)=>{
      console.error("Error al inhabilitar", err);
      showApiErrorToast(err);
    }
  });
};

export const useDownloadProjectPdf = () => {
  return useMutation<void, Error, { id: number; name?: string }>({
    mutationFn: ({ id, name }) => downloadProjectPdfFile(id, name),
    onError: (err) => {
      console.error("Error descargando PDF del proyecto", err);
      toast.error("No se pudo descargar el PDF del proyecto");
    },
  });
};
