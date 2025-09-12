import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createCategory, deleteCategory, getAllCategory, searchCategories, UpdateCategory } from "../Services/CategoryServices";
import type { CategoriesPaginationParams, Category, UpdateCategoryDto } from "../Models/Category";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

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

    const mutation = useMutation<Category, Error, {id: number; data: UpdateCategoryDto }>({
        mutationFn: ({id, data}) => UpdateCategory(id, data),
        onSuccess :(res)=>{
            console.log('Categoría Actualizada', console.log(res))
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

export const useSearchCategories = (params: CategoriesPaginationParams) => {
  const query = useQuery<PaginatedResponse<Category>, Error>({
    queryKey: ["categories", "search", params],
    queryFn: () => searchCategories(params),
    placeholderData: keepPreviousData,   // v5
    staleTime: 30_000,
  });

  // ⬇️ Log en cada fetch/refetch exitoso
  useEffect(() => {
    if (query.data) {
      const res = query.data; // res: PaginatedResponse<Category>
      console.log(
        "[Categories fetched]",
        {
          page: res.meta.page,
          limit: res.meta.limit,
          total: res.meta.total,
          pageCount: res.meta.pageCount,
          params,
        },
        res.data // array de Category
      );
    }
  }, [query.data, params]);

  return query;
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      console.log("Categoria inhabilitada", res);
    },
    onError: (err)=>{
      console.error("Error al inhabilitar", err);
    }
  });
};