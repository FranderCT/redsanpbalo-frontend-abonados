import apiAxios from "../../../api/apiConfig";
import type { Material, NewMaterial } from "../Models/Material";


export async function createMaterial(payload: NewMaterial): Promise<Material> {
  const res = await apiAxios.post<Material>("/material", payload);
  return res.data;
}


export async function getAllMaterials () : Promise<Material[]>{
    const res = await apiAxios.get<Material[]>(`/material`);
    return res.data;
}

export async function updateMaterial(
  id: number,
  payload: NewMaterial
): Promise<Material> {
  const res = await apiAxios.put<Material>(`/material/${id}`, payload);
  return res.data;
}


export async function deleteMaterial(id: number): Promise<void> {
  await apiAxios.delete<void>(`/material/${id}`);
}
