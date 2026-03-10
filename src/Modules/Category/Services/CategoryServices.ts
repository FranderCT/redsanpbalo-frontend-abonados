import apiAxios from "../../../api/apiConfig";
import type { CategoriesPaginationParams, Category, NewCategory, UpdateCategoryDto } from "../Models/Category";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";

export async function createCategory(payloads: NewCategory): Promise<NewCategory> {
  try {
    const { data } = await apiAxios.post<NewCategory>("category", payloads);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function updateCategory(id: number, payloads: UpdateCategoryDto): Promise<Category> {
  try {
    const { data } = await apiAxios.put<Category>(`category/${id}`, payloads);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getAllCategory(): Promise<Category[]> {
  try {
    const { data } = await apiAxios.get<Category[]>("categories");
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function searchCategories(
  params: CategoriesPaginationParams
): Promise<PaginatedResponse<Category>> {
  try {
    const { page = 1, limit = 10, q, state } = params ?? {};
    const { data } = await apiAxios.get<PaginatedResponse<Category>>("category/search", {
      params: {
        page,
        limit,
        q: q?.trim() || undefined,
        state,
      },
    });
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function deleteCategory(id: number): Promise<void> {
  try {
    await apiAxios.delete(`/category/${id}`);
  } catch (error) {
    return Promise.reject(error);
  }
}
