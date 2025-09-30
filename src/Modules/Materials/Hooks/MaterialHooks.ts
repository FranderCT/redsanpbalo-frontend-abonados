// Hooks/MaterialHooks.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Material, MaterialPaginationParams, updateMaterialDto } from "../Models/Material";
import {
  createMaterial,
  deleteMaterial,
  getAllMaterials,
  getMaterialById,
  searchMaterials,
  updateMaterial,
}
  from "../Services/MaterialServices";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

// Obtener todos
export const useGetAllMaterials = () => {
  const { data: materials, isPending, error } = useQuery({
    queryKey: ["materials"],
    queryFn: getAllMaterials,
  });
  return { materials, isPending, error };
};

export const useSearchMaterials = (params: MaterialPaginationParams) => {
  const query = useQuery<PaginatedResponse<Material>, Error>({
    queryKey: ["materials", "search", params],
    queryFn: () => searchMaterials(params),
    placeholderData: keepPreviousData,   // v5
    staleTime: 30_000,
  });

  // ⬇️ Log en cada fetch/refetch exitoso
  useEffect(() => {
    if (query.data) {
      const res = query.data; 
      console.log(
        "[Materials fetched]",
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
export const useGetMaterialById = (id?: number) => {
  const { data: material, isPending, error } = useQuery({
    queryKey: ["materials", id],
    queryFn: () => getMaterialById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
  return { material, isPending, error };
};

// Crear
export const useCreateMaterial = () => {
  const qc = useQueryClient();
  const mutation = useMutation({
      mutationFn: createMaterial,
      onSuccess: (res) =>{
          console.log('Material creado correctamente',res)
          qc.invalidateQueries({queryKey: ['materials']})
      },
      onError: (err) =>{
          console.error('Error al crear', err)
      }
  })

  return mutation;
};

// Actualizar
export const useUpdateMaterial = () => {
  const qc = useQueryClient();
  
  const mutation = useMutation<Material, Error, {id: number; data: updateMaterialDto }>({
      mutationFn: ({id, data}) => updateMaterial(id, data),
      onSuccess :(res)=>{
          console.log('Material Actualizado', console.log(res))
          qc.invalidateQueries({queryKey: [`materials`]})
      },
      onError: (err) =>{
          console.error(err);
      }
  })

  return mutation;
};

// Eliminar
export const useDeleteMaterial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMaterial(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["materials"] });
      console.log("Material inhabilitado", res);
    },
    onError: (err)=>{
      console.error("Error al inhabilitar", err);
    }
  });
};
