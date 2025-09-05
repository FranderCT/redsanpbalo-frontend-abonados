import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMaterial, deleteMaterial, getAllMaterials, updateMaterial } from "../Services/MaterialServices";
import type { Material, NewMaterial } from "../Models/Material";


export const useCreateMaterial = () => {
    const qc = useQueryClient();

    const mutation = useMutation({
        mutationFn: createMaterial,
        onSuccess: (res) =>{
            console.log("Mateiral Creado", res);
            qc.invalidateQueries({ queryKey: ['materials'] });
        },
        onError: (err) => {
            console.error("Error al crear el maaterial:", err)
        }
    });
    return mutation;
}

export const useGetAllMaterials = () => {
    const {data: materials, isLoading, error} = useQuery({
        queryKey: ['materials'],
        queryFn: getAllMaterials,
    });
    return {materials, isLoading, error}
}

export const useUpdateMaterial = () => {
  const qc = useQueryClient();
  return useMutation<Material, Error, { id: number; data: NewMaterial }>({
    mutationFn: ({ id, data }) => updateMaterial(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};


export const useDeleteMaterial = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteMaterial(id),
    onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};
