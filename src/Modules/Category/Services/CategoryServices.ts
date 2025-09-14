import apiAxios from "../../../api/apiConfig";
import type { CategoriesPaginationParams, Category, NewCategory, UpdateCategoryDto } from "../Models/Category";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";

export async function createCategory(payloads: NewCategory) : Promise<NewCategory>{
    try{
        const {data} = await apiAxios.post<NewCategory>(`categories`, payloads);
        return data;
    }catch(err){
        console.log(err);
        return Promise.reject(err);
    }
}

export async function UpdateCategory (id: number, payloads: UpdateCategoryDto) : Promise<Category>{
    try{
        const {data} = await apiAxios.put<Category>(`categories/${id}`, payloads)
        return data;
    }catch(err){
        console.log('Error descondico',err)
        return Promise.reject(err)
    }
}

export async function getAllCategory () : Promise<Category[]>{
    try{
        const {data} = await apiAxios.get<Category[]>('categories')
        return data;
    }catch(err){
        console.error("Error", err);
        return Promise.reject(err)
    }
}

export async function searchCategories(
  params: CategoriesPaginationParams
): Promise<PaginatedResponse<Category>> {
  try {
    const { page = 1, limit = 10, name, state } = params ?? {};
    const { data } = await apiAxios.get<PaginatedResponse<Category>>("categories/search", {
      params: { page, limit, name, state },
    });
    return data;
  } catch (err) {
    console.error("Error buscando categorías", err);
    return Promise.reject(err);
  }
}

export async function deleteCategory(id: number): Promise<void> {
  try {
    await apiAxios.delete(`/categories/${id}`);
  } catch (error) {
    console.error("Error al inhabilitar la categoría", error);
  }
}