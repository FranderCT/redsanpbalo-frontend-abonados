import apiAxios from "../../../api/apiConfig";
import type { CategoriesPaginationParams, Category, NewCategory, UpdateCategoryDto } from "../Models/Category";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export async function createCategory(payload: NewCategory): Promise<NewCategory> {
  const { data } = await apiAxios.post<NewCategory>("categories", payload);
  return data;
}

export async function updateCategory(id: number, payload: UpdateCategoryDto): Promise<Category> {
  const { data } = await apiAxios.put<Category>(`categories/${id}`, payload);
  return data;
}

export async function getAllCategory(): Promise<Category[]> {
  const { data } = await apiAxios.get<Category[]>("categories");
  return data;
}

export async function searchCategories(
  params: CategoriesPaginationParams
): Promise<PaginatedResponse<Category>> {
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, q, state } = params;
  const { data } = await apiAxios.get<PaginatedResponse<Category>>("categories/search", {
    params: {
      page,
      limit,
      q: q?.trim() || undefined,
      state,
    },
  });

  return data;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiAxios.delete(`/categories/${id}`);
}
