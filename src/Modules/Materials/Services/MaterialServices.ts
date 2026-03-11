// Services/MaterialServices.ts
import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { Material, MaterialPaginationParams, NewMaterial, UpdateMaterialDto } from "../Models/Material";

const BASE = "/material"; 

export async function getAllMaterials(): Promise<Material[]> {
  try {
    const { data } = await apiAxios.get<Material[]>(BASE);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function searchMaterials(
  params: MaterialPaginationParams
): Promise<PaginatedResponse<Material>> {
  try {
    const { page = 1, limit = 10, q, state } = params ?? {};
    const { data } = await apiAxios.get<PaginatedResponse<Material>>(`${BASE}/search`, {
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

export async function getMaterialById(id: number): Promise<Material> {
  const res = await apiAxios.get<Material>(`${BASE}/${id}`);
  return res.data;
}

export async function createMaterial(payload: NewMaterial): Promise<NewMaterial> {
  try {
    const { data } = await apiAxios.post<Material>(BASE, payload);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function updateMaterial(id: number, payload: UpdateMaterialDto): Promise<Material> {
  try {
    const { data } = await apiAxios.put<Material>(`${BASE}/${id}`, payload);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function deleteMaterial(id: number): Promise<void> {
  try {
    await apiAxios.delete(`${BASE}/${id}`);
  } catch (error) {
    return Promise.reject(error);
  }
}
