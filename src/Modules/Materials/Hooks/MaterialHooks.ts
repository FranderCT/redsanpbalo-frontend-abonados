// Hooks/MaterialHooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Material } from "../Models/Material";
import {
  createMaterial,
  deleteMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
} from "../Services/MaterialServices";

// Obtener todos
export const useGetAllMaterials = () => {
  const { data: materials, isPending, error } = useQuery({
    queryKey: ["materials"],
    queryFn: getAllMaterials,
  });
  return { materials, isPending, error };
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
    onError: (err) => {
      console.error("Error al crear material:", err);
    },
  });
};

// Actualizar
export const useUpdateMaterial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Material }) =>
      updateMaterial(id, data),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["materials"] });
      qc.invalidateQueries({ queryKey: ["materials", vars.id] });
    },
    onError: (err) => {
      console.error("Error al actualizar material:", err);
    },
  });
};

// Eliminar
export const useDeleteMaterial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMaterial(id),
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: ["materials"] });
      qc.invalidateQueries({ queryKey: ["materials", id] });
    },
    onError: (err) => {
      console.error("Error al eliminar material:", err);
    },
  });
};
