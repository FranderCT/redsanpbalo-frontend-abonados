import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, deleteCategory, getAllCategory, searchCategories, updateCategory } from "../Services/CategoryServices";
import type { CategoriesPaginationParams, Category, UpdateCategoryDto } from "../Models/Category";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";

export const useCreateCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();

  return useMutation<Category, Error, { id: number; data: UpdateCategoryDto }>({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useGetAllCategory = () => {
  const { data: category = [], isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategory,
  });

  return { category, isLoading, error };
};

export const useSearchCategories = (params: CategoriesPaginationParams) => {
  return useQuery<PaginatedResponse<Category>, Error>({
    queryKey: ["categories", "search", params],
    queryFn: () => searchCategories(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
