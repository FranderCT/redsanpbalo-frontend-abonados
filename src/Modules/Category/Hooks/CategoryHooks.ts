import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, deleteCategory, getAllCategory, searchCategories, updateCategory } from "../Services/CategoryServices";
import type { CategoriesPaginationParams, Category, UpdateCategoryDto } from "../Models/Category";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";

const CATEGORY_QUERY_KEY = ["categories"] as const;

export const useCreateCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();

  return useMutation<Category, Error, { id: number; data: UpdateCategoryDto }>({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
  });
};

export const useGetAllCategory = () => {
  const { data: category = [], isLoading, error } = useQuery({
    queryKey: CATEGORY_QUERY_KEY,
    queryFn: getAllCategory,
  });

  return { category, isLoading, error };
};

export const useSearchCategories = (params: CategoriesPaginationParams) => {
  return useQuery<PaginatedResponse<Category>, Error>({
    queryKey: [...CATEGORY_QUERY_KEY, "search", params],
    queryFn: () => searchCategories(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
  });
};
