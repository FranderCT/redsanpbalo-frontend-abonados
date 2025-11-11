import apiAxios from "../../../api/apiConfig";
import type { ProveedorFisico } from "../Models/ProveedorFisico";

export async function createProveedorFisico(proveedor: ProveedorFisico): Promise<ProveedorFisico> {
    const response = await apiAxios.post<ProveedorFisico>("/physical-supplier", proveedor);
    return response.data;
}