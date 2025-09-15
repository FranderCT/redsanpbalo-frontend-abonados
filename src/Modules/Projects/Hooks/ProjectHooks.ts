// Hooks/MaterialHooks.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";
import { createProject, deleteProject, getAllProjects, getProjectById, searchProjects } from "../Services/ProjectServices";
import type { Project, ProjectPaginationParams } from "../Models/Project";

// Obtener todos
export const useGetAllProjects = () => {
  const { data: projects, isPending, error } = useQuery({
    queryKey: ["projects"],
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
  const query = useQuery<PaginatedResponse<Project>, Error>({
    queryKey: ["projects", "search", params],
    queryFn: () => searchProjects(params),
    placeholderData: keepPreviousData,   // v5
    staleTime: 30_000,
  });

  // ⬇️ Log en cada fetch/refetch exitoso
  useEffect(() => {
    if (query.data) {
      const res = query.data; 
      console.log(
        "[Projects fetched]",
        {
          page: res.meta.page,
          limit: res.meta.limit,
          total: res.meta.total,
          pageCount: res.meta.pageCount,
          params,
        },
        res.data 
      );
    }
  }, [query.data, params]);

  return query;
};


// Obtener por ID
export const useGetProjectById = (id?: number) => {
  const { data: project, isPending, error } = useQuery({
    queryKey: ["projects", id],
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
          qc.invalidateQueries({queryKey: ['projects']})
      },
      onError: (err) =>{
          console.error('Error al crear', err)
      }
  })

  return mutation;
};

// Actualizar
// export const useUpdateProject = () => {
//   const qc = useQueryClient();
  
//   const mutation = useMutation<Project, Error, {id: number; data: updateProjectDto }>({
//       mutationFn: ({id, data}) => updateProject(id, data),
//       onSuccess :(res)=>{
//           console.log('Proyecto Actualizado', console.log(res))
//           qc.invalidateQueries({queryKey: [`projects`]})
//       },
//       onError: (err) =>{
//           console.error(err);
//       }
//   })

//   return mutation;
// };

// Eliminar
export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      console.log("Proyecto inhabilitado", res);
    },
    onError: (err)=>{
      console.error("Error al inhabilitar", err);
    }
  });
};
