import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { NewProduct, Product, ProductPaginationParams, UpdateProduct } from "../Models/CreateProduct";

const BASE = "/product";

export async function getAllProducts(): Promise<Product[]> {
  const res = await apiAxios.get<Product[]>(BASE);
  return res.data;
}

export async function searchProducts(
  params: ProductPaginationParams
): Promise<PaginatedResponse<Product>> {
  try {
    const {
      page = 1,
      limit = 10,
      q,
      name,
      categoryId,
      materialId,
      unitId,
      supplierId,
      state,
    } = params ?? {};

    const normalizedState =
      state === "1" || state === "true" ? true :
      state === "0" || state === "false" ? false :
      state;

    const { data } = await apiAxios.get<PaginatedResponse<Product>>(`${BASE}/search`, {
      params: {
        page,
        limit,
        q: q?.trim() || undefined,
        name: name?.trim() || undefined,
        categoryId,
        materialId,
        unitId,
        supplierId,
        state: normalizedState,
      },
    });

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function createProduct(payload: NewProduct): Promise<Product> {
  try {
    const { data } = await apiAxios.post<Product>(BASE, payload);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getProductById(id: number): Promise<Product> {
  const res = await apiAxios.get<Product>(`${BASE}/${id}`);
  return res.data;
}

export async function updateProduct(id: number, payload: UpdateProduct): Promise<Product> {
  const res = await apiAxios.put<Product>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    await apiAxios.delete(`${BASE}/${id}`);
  } catch (err) {
    return Promise.reject(err);
  }
}
