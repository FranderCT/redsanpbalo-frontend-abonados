// Services/MaterialServices.ts
import apiAxios from "../../../api/apiConfig";
import type { Material } from "../Models/Material";

const BASE = "/material"; 

export async function getAllMaterials(): Promise<Material[]> {
  const res = await apiAxios.get<Material[]>(BASE);
  return res.data;
}

export async function getMaterialById(id: number): Promise<Material> {
  const res = await apiAxios.get<Material>(`${BASE}/${id}`);
  return res.data;
}

export async function createMaterial(payload: Material): Promise<Material> {
  const res = await apiAxios.post<Material>(BASE, payload);
  return res.data;
}

export async function updateMaterial(id: number, payload: Material): Promise<Material> {
  // Usa PATCH si tu backend lo espera
  const res = await apiAxios.put<Material>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function deleteMaterial(id: number): Promise<void> {
  await apiAxios.delete(`${BASE}/${id}`);
}
