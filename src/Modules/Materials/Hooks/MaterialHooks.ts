// Hooks/MaterialHooks.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Material, MaterialPaginationParams, UpdateMaterialDto } from "../Models/Material";
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

// Obtener todos
export const useGetAllMaterials = () => {
  const { data: materials, isPending, error } = useQuery({
    queryKey: ["materials"],
    queryFn: getAllMaterials,
  });
  return { materials, isPending, error };
};

export const useSearchMaterials = (params: MaterialPaginationParams) => {
  return useQuery<PaginatedResponse<Material>, Error>({
    queryKey: ["materials", "search", params],
    queryFn: () => searchMaterials(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
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

  return useMutation({
    mutationFn: createMaterial,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
    },
  });
};

// Actualizar
export const useUpdateMaterial = () => {
  const qc = useQueryClient();
  
  return useMutation<Material, Error, {id: number; data: UpdateMaterialDto }>({
    mutationFn: ({id, data}) => updateMaterial(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
    },
  });
};

// Eliminar
export const useDeleteMaterial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMaterial(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
    }
  });
};
