import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../Category/Models/PaginationCategory";
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
        const { page = 1, limit = 10, name, categoryId, materialId, unitId, state } = params ?? {};
        const { data } = await apiAxios.get<PaginatedResponse<Product>>(`${BASE}/search`, {
        params: { page, limit, name, categoryId, materialId, unitId, state },
        });
        return data;
    } catch (err) {
        console.error("Error buscando productos", err);
        return Promise.reject(err);
    }
}

export async function createProduct(payloads: NewProduct) : Promise<NewProduct>{
    try{
        const {data} = await apiAxios.post<NewProduct>(BASE, payloads);
        return data;
    }catch(err){
        console.log(err);
        return Promise.reject(err);
    }

}

export async function getProductById(id: number): Promise<Product> {
    const res = await apiAxios.get<Product>(`${BASE}/${id}`);
    return res.data;
}

export async function updateProduct(id: number, payload: UpdateProduct): Promise<Product> {
  // Usa PATCH si tu backend lo espera
    const res = await apiAxios.put<Product>(`${BASE}/${id}`, payload);
    return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
    try{
        await apiAxios.delete(`${BASE}/${id}`);
    }catch(err){
        console.log(err);
    }

}
