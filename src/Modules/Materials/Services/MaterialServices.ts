// Services/MaterialServices.ts
import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { Material, MaterialPaginationParams, newMaterial, updateMaterialDto } from "../Models/Material";

const BASE = "/material"; 

export async function getAllMaterials(): Promise<Material[]> {
  try{
    const {data} = await apiAxios.get<Material[]>(BASE)
    return data;
  }catch(err){
    console.error("Error", err);
    return Promise.reject(err)
  }
}

export async function searchMaterials(
  params: MaterialPaginationParams
): Promise<PaginatedResponse<Material>> {
  try {
    const { page = 1, limit = 10, name, state } = params ?? {};
    const { data } = await apiAxios.get<PaginatedResponse<Material>>(`${BASE}/search`, {
      params: { page, limit, name, state },
    });
    return data;
  } catch (err) {
    console.error("Error buscando Materiales", err);
    return Promise.reject(err);
  }
}

export async function getMaterialById(id: number): Promise<Material> {
  const res = await apiAxios.get<Material>(`${BASE}/${id}`);
  return res.data;
}

export async function createMaterial(payload: newMaterial): Promise<newMaterial> {
  try{
    const {data} = await apiAxios.post<Material>(BASE, payload);
    return data;
  }catch(err){
    console.log(err);
    return Promise.reject(err);
  }
}

export async function updateMaterial(id: number, payload: updateMaterialDto): Promise<Material> {
  try{
    const {data} = await apiAxios.put<Material>(`${BASE}/${id}`, payload)
    return data;
  }catch(err){
    console.log('Error descondico',err)
    return Promise.reject(err)
  }
}

export async function deleteMaterial(id: number): Promise<void> {
  try{
    await apiAxios.delete(`${BASE}/${id}`);
  } catch (error) {
    console.error("Error al eliminar el material", error);
  }
}
