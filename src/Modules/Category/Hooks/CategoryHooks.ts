import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createCategory, getAllCategory, UpdateCategory } from "../Services/CategoryServices";
import type { Category, NewCategory } from "../Models/Category";

export const useCreateCategory = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: createCategory,
        onSuccess: (res) =>{
            console.log('Categoría creada correctamente',res)
            qc.invalidateQueries({queryKey: ['categories']})
        },
        onError: (err) =>{
            console.error('Error al crear', err)
        }
    })

    return mutation;
}

export const useUpdateCategory = () =>{
    const qc = useQueryClient();

    const mutation = useMutation<Category, Error, {id: number; data: NewCategory }>({
        mutationFn: ({id, data}) => UpdateCategory(id, data),
        onSuccess :(res)=>{
            console.log('Categoría Creada', console.log(res))
            qc.invalidateQueries({queryKey: [`categories`]})
        },
        onError: (err) =>{
            console.error(err);
        }
    })

    return mutation;
}

export const useGetAllCategory = () => {
    const {data: category = [], isLoading, error} = useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategory,
    });

    return{category, isLoading, error}
}